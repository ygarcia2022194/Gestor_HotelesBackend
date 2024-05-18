import Reservation from "./reservation.model";
import Room from "../room/room.model.js"
import {request, response} from "express";
import {validationResult} from 'express-validator';

export const priceReservation = async(roomId, dateStart, dateFinish)=>{
    try {
        const room = await Room.findById(roomId);
        if(!room){
            throw new Error('Room not found')
        }
        const diffTime = dateFinish.getTime() - dateStart.getTime();
        const diffDays = Math.ceil(diffTime /(1000 * 60 *60 * 24));

        const totalPrice = room.priceRoom * diffDays;

        return totalPrice;
    } catch (error) {
        throw new Error('Error al calcular el precio de la reservacion: '+ error.message);
    }
}

export const reservationPost = async(req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: 'Room not found'});
    }

    const {roomId, dateStart, dateFinish, huespedes} = req.body;
    try {
        const roomExist = await Room.findOne({_id: roomId})
        if(!roomExist){
            return res.status(404).json({error: 'room not found'});
        }

        const dateStart2 = new Date(dateStart);
        const dateFinish2 = new Date(dateFinish);

        const priceReserv = await priceReservation(roomId, dateStart2, dateFinish2);

        const reservation = new Reservation({
            room: roomId,
            dateStart: dateStart2,
            dateFinish: dateFinish2,
            huespedes,
            estado: 'Pendiente',
            pago: priceReserv
        })
        await reservation.save();

        res.status(201).json({message: 'Reservation create', reservation})
    } catch (error) {
        console.error('Error al crear la reservacion: ', error);
        res.status(500).json({error: 'Error al crear la reservacion'})
    }
}

export const reservationGet = async (req, res) =>{
    try {
        const reservation = await Reservation.find().populate('room');
        res.status(200).json({reservation});
    } catch (error) {
        console.error('Error al obtener las reservaciones:', error);
        res.status(500).json({ error: 'Error al obtener las reservaciones' });
    }
}


export const reservationPut = async (req, res) =>{
    const {id} = req.params;

    try {
        const existReserv = await Reservation.findById(id);
        if(!existReserv){
            return res.status(404).json({ error: 'Reservación no encontrada' });
        }

        const {_id, ...resto} = req.body;
        const reservUpdate = await Reservation.findByIdAndUpdate(id, resto, {new: true});
        res.status(200).json({ mensaje: 'Reservación actualizada exitosamente', reservation: reservUpdate });
    } catch (error) {
        console.error('Error al actualizar la reservación:', error);
        res.status(500).json({ error: 'Error al actualizar la reservación' });
    }
}

export const reservationDelete = async (req,res) =>{
    const {id} = req.params;

    try {
        const existReserv = await Reservation.findById(id);
        if(!existReserv){
            return res.status(404).json({ error: 'Reservación no encontrada' });
        }

        await Reservation.findByIdAndDelete(id);
        res.status(200).json({ mensaje: 'Reservación eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar la reservación:', error);
        res.status(500).json({ error: 'Error al eliminar la reservación' });
    }
}