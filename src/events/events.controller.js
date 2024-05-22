import { response, request } from "express";
import Events from '../events/events.model.js';


export const eventPost = async (req, res) => {
    try {
        const { nameEvent, description, dateEvent, hotelId } = req.body;

        // Crear una nueva instancia del evento
        const nuevoEvento = new Events({
            nameEvent,
            description,
            dateEvent,
            hotel: hotelId,
       //     service: serviceId,serviceId,
       //     user: userId,  userId
        });

        // Guardar el nuevo evento en la base de datos
        await nuevoEvento.save();

        // Devolver el evento recién creado como respuesta
        res.status(200).json({ evento: nuevoEvento });
    } catch (error) {
        console.error('Error al crear evento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const eventGet = async (req, res) => {
    const { limite = 10, desde = 0 } = req.query;

    try {
        const [total, eventos] = await Promise.all([
            Events.countDocuments(),
            Events.find()
                .populate('hotel')
               // .populate('service')
               // .populate('user')
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            total,
            eventos
        });
    } catch (error) {
        console.error('Error al obtener eventos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const eventPut = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, ...resto } = req.body;

        const usuario = req.usuario;

        if (usuario.role !== 'ADMIN_ROLE') {
            return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.' });
        }

        await Events.findByIdAndUpdate(id, resto);

        const eventoActualizado = await Events.findOne({ _id: id });

        if (!eventoActualizado) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        res.status(200).json({
            msg: 'Evento actualizado',
            evento: eventoActualizado
        });
    } catch (error) {
        console.error('Error al actualizar evento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getEventById = async (req, res) => {
    try {
        const eventoEncontrado = await Events.findOne({ _id: id }).populate('hotel').populate('service').populate('user');

        if (!eventoEncontrado) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        res.status(200).json({ evento: eventoEncontrado });
    } catch (error) {
        console.error('Error al obtener evento por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        
        const eventoEliminado = await Events.findByIdAndUpdate(id, { estado: false });

        if (!eventoEliminado) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        res.status(200).json({ msg: 'Evento eliminado', evento: eventoEliminado });
    } catch (error) {
        console.error('Error al eliminar evento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
