import Reservation from "./reservation.model.js";
import Room from "../room/room.model.js"
import Service from "../services/services.model.js"

const convertirFecha = (fecha) =>{
    const [dia, mes, año] = fecha.split('/');
    return new Date(`${año}-${mes}-${dia}`);
}
export const calcularDias = (dateStart, dateFinish) =>{
    const unDia = 24/60*60*1000;
    const inicio = convertirFecha(dateStart);
    const fin = convertirFecha(dateFinish)

    const diferenciaEnMilisegundos = fin - inicio;
    const diferenciaEnDias = Math.round(diferenciaEnMilisegundos / unDia);
    return diferenciaEnDias;
}

export const reservPost = async (req, res) => {
    const { dateStart, dateFinish, huespedes, listService } = req.body;
    const { roomId } = req.params;

    if (!roomId) {
        return res.status(400).json({ error: 'El ID de la habitación es obligatorio.' });
    }

    try {
        const room = await Room.findById(roomId);

        if (!room) {
            return res.status(404).json({ error: 'Habitación no encontrada.' });
        }

        if (room.status === 'OCUPADA') {
            return res.status(400).json({ msg: "La habitación no está disponible" });
        }

        const dias = calcularDias(dateStart, dateFinish);
        if (isNaN(dias) || dias <= 0) {
            return res.status(400).json({ msg: "Fechas inválidas proporcionadas" });
        }

        let total = dias * room.priceRoom;
        console.log('Total inicial:', total);
        if (isNaN(total)) {
            return res.status(400).json({ msg: "Error en el cálculo del precio de la habitación" });
        }

        const serviciosUtilizadosIds = listService ? listService.split(',') : [];
        const serviciosUtilizados = await Service.find({ _id: { $in: serviciosUtilizadosIds } });

        if (serviciosUtilizados.length !== serviciosUtilizadosIds.length) {
            return res.status(404).json({ msg: "Algunos servicios solicitados no están disponibles" });
        }

        serviciosUtilizados.forEach(servicio => {
            total += dias * servicio.price;
        });

        if (isNaN(total)) {
            return res.status(400).json({ msg: "Error en el cálculo del precio total de los servicios" });
        }

        const newReservation = new Reservation({
            room: room._id,
            dateStart: convertirFecha(dateStart),
            dateFinish: convertirFecha(dateFinish),
            listService: serviciosUtilizados.map(servicio => servicio._id),
            total,
            huespedes
        });

        await newReservation.save();

        room.status = 'OCUPADA';
        await room.save();

        res.status(201).json({
            msg: "Reservación registrada con éxito, ahora no se puede modificar nada, si desea cancelarla, comuníquese con el hotel",
            newReservation
        });
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor', details: error.message });
    }
};

export const reservGet = async (req, res) =>{
    const { limite, desde } = req.query;
    const query = { estado: true };

    try {
        const [total, reservacion] = await Promise.all([
            Reservation.countDocuments(query),
            Reservation.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            total,
            reservacion
        });
    } catch (error) {
        console.error('Error al obtener reservaciones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export const reservPut = async (req, res) =>{
    try {
        const {id} = req.params;
        const {_id, ...resto} = req.body;
        await Reservation.findByIdAndUpdate(id, resto);
        const reservActualizada = await Reservation.findOne({ _id: id });

        if (!reservActualizada) {
            return res.status(404).json({ error: 'Habitación no encontrada' });
        }

        res.status(200).json({
            msg: 'Habitación actualizada',
            reservacion: reservActualizada
        });
    } catch (error) {
        console.error('Error al actualizar habitación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export const reservDelete = async (req, res) =>{
    try {
        const {id} = req.params;
        const reservEliminada = await Reservation.findByIdAndUpdate(id, {estado: false});
        if (!reservEliminada) {
            return res.status(404).json({ error: 'Reservacion no encontrada' });
        }
        res.status(200).json({ msg: 'Reservacion eliminada', reservacion: reservEliminada});
        console.error('Error al eliminar habitación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    } catch (error) {
        console.error('Error al eliminar la reservacion:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


