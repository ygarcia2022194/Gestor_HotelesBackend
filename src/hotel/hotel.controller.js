import { response, request } from "express";
import Hotel from '../hotel/hotel.model.js';

export const hotelGet = async (req, res) => {
    const { limite, desde } = req.query;
    const query = { status: true };

    try {
        const [total, hoteles] = await Promise.all([
            Hotel.countDocuments(query),
            Hotel.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            total,
            hoteles
        });
    } catch (error) {
        console.error('Error al obtener hoteles:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const hotelPost = async (req, res) => {
    try {
        const usuario = req.usuario;

        if (usuario.role !== 'ADMIN_ROLE_HOTEL') {
            return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.' });
        }

        const { nameHotel, address, description } = req.body;

        const nuevoHotel = new Hotel({
            nameHotel,
            address,
            description
        });

        await nuevoHotel.save();

        res.status(200).json({ hotel: nuevoHotel });
    } catch (error) {
        console.error('Error al crear hotel:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const hotelPut = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, password, google, correo, ...resto } = req.body;

        const usuario = req.usuario;

        if (usuario.role !== 'ADMIN_ROLE_HOTEL') {
            return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.' });
        }

        if (password) {
            const salt = bcryptjs.genSaltSync();
            resto.password = bcryptjs.hashSync(password, salt);
        }

        await Hotel.findByIdAndUpdate(id, resto);

        const hotelActualizado = await Hotel.findOne({ _id: id });

        if (!hotelActualizado) {
            return res.status(404).json({ error: 'Hotel no encontrado' });
        }

        res.status(200).json({
            msg: 'Hotel actualizado',
            hotel: hotelActualizado
        });
    } catch (error) {
        console.error('Error al actualizar hotel:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const hotelDelete = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = req.usuario;

        if (usuario.role !== 'ADMIN_ROLE_HOTEL') {
            return res.status(403).json({ error: 'Acceso denegado. El usuario no tiene permisos para realizar esta función.' });
        }

        const hotelEliminado = await Hotel.findByIdAndUpdate(id, { status: false });

        if (!hotelEliminado) {
            return res.status(404).json({ error: 'Hotel no encontrado' });
        }

        res.status(200).json({ msg: 'Hotel eliminado', hotel: hotelEliminado });
    } catch (error) {
        console.error('Error al eliminar hotel:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getHotelById = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = req.usuario;

        const hotelEncontrado = await Hotel.findOne({ _id: id });

        if (!hotelEncontrado) {
            return res.status(404).json({ error: 'Hotel no encontrado' });
        }

        res.status(200).json({ hotel: hotelEncontrado });
    } catch (error) {
        console.error('Error al obtener hotel por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
