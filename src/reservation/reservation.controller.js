import Reservation from "./reservation.model.js";


export const reservPost = async (req, res) =>{
    try {
        const {dateStart, dateFinish, huespedes, roomId} = req.body;
        const newReserv = new Reservation({
            dateStart,
            dateFinish,
            huespedes, 
            room: roomId
        })

        await newReserv.save();

        res.status(200).json({reservation: newReserv});
    } catch (error) {
        console.error('Error al crear la reservacion', error);
        res.status(500).json({error: 'Error interno del servidor'})
    }
}

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


