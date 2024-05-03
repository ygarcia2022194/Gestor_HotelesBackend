import { check } from "express-validator";
import { Router } from "express";
import { deleteReservation, getReservations, postReservation, putReservation } from "./reservation.controller";
import {validarJWT} from "../middlewares/validar-jwt";

const router = Router();

router.post('/', [
    validarJWT,
    check('dateStart', 'La fecha de inicio es obligatoria').not().isEmpty(),
    check('dateFinish', 'La fecha de fin es obligatoria').not().isEmpty(),
    check('room', 'La habitación es obligatoria').not().isEmpty(),
], postReservation);

router.get('/', getReservations);

router.put('/:reservationId', validarJWT, putReservation);

router.delete('/:reservationId', validarJWT, deleteReservation);