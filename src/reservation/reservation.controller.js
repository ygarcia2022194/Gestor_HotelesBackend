import ReservationModel from "./reservation.model";
import {request, response} from "express";

export const postReservation = async (req = request, res = response) => {
    try {
        const { dateStart, dateFinish, room } = req.body;
        const user = req.usuario._id;

        const reservation = new ReservationModel({ dateStart, dateFinish, room, user });
        console.log(reservation);

        await reservation.save();

        res.status(200).json({ reservation });
    } catch (error) {
        console.error('Error al crear reserva:', error);
    }
}

export const getReservations = async (req = request, res = response) => {
    try {
        const reservations = await ReservationModel.find();
        res.status(200).json({ reservations });
    } catch (error) {
        console.error('Error al obtener reservas:', error);
    }
}

export const putReservation = async (req = request, res = response) => {
    try {
        const { reservationId } = req.params;
        const { room, ...resto } = req.body;
        const user = req.usuario._id;

        const reservation = await ReservationModel.findByIdAndUpdate(reservationId, resto);

        const updatedReservation = await ReservationModel.findById(reservationId)

        res.status(200).json({ updatedReservation });
    } catch (error) {
        console.error('Error al actualizar reserva:', error);
    }
}

export const deleteReservation = async (req = request, res = response) => {
    try {
        const { reservationId } = req.params;
        const user = req.usuario._id;

        const reservation = await ReservationModel.findByIdAndDelete(reservationId);

        res.status(200).json({ reservation });
    } catch (error) {
        console.error('Error al eliminar reserva:', error);
    }
}