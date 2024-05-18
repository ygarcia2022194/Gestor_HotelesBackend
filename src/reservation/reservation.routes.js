import { check } from "express-validator";
import { Router } from "express";
import {reservationDelete, reservationGet, reservationPost, reservationPut } from "./reservation.controller";
import {validarJWT} from "../middlewares/validar-jwt";
import {
    validarFecha,
    validarNumeroHuespedes,
    validarCapacidad,
    validarDisponibilidad,
    existeReservacionById
} from "../helpers/db-validators.js";

import { validarCampos } from "../middlewares/validar-campos.js";
const router = Router();

router.post('/', [
    check("roomId", "El ID de la habitación es obligatorio").not().isEmpty(),
        check("roomId").custom(validarCapacidad),
        check("dateStart", "La fecha de inicio es obligatoria").not().isEmpty(),
        check("dateFinish", "La fecha de fin es obligatoria").not().isEmpty(),
        check("dateStart", "La fecha de inicio debe ser anterior a la fecha de fin").custom((value, { req }) => {
            return validarFecha(req.body.dateStart, req.body.dateFinish);
        }),
        check("huespedes", "El número de huéspedes es obligatorio").not().isEmpty(),
        check(["roomId", "dateStart", "dateFinish"]).custom(async (value, { req }) => {
            const { roomId, dateStart, dateFinish} = req.body;
            return validarDisponibilidad(roomId, dateStart, dateFinish);
        }),
        validarCampos
], reservationPost);

router.get('/', reservationGet);

router.put('/:id', 
[
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(existeReservacionById),
    validarCampos
]
, reservationPut);

router.delete('/:id', 
[
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(existeReservacionById),
    validarCampos
]
, reservationDelete);

export default router;