import express from 'express';
import Reservation from '../reservation/reservation.model.js';
import Room from '../room/room.model.js';

export const obtenerReservacionesPorHabitacion = async (req, res) => {
    try {
        const reservations = await Reservation.aggregate([
            { $group: { _id: '$room', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]).exec();

        const rooms = await Room.find({
            _id: { $in: reservations.map(reservation => reservation._id) }
        }).exec();

        const data = rooms.map(room => {
            const reservationCount = reservations.find(r => r._id.equals(room._id)).count;
            return {
                ...room.toJSON(),
                reservationCount
            };
        });

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};