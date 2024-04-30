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
