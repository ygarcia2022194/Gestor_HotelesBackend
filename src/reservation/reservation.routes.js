import { check } from "express-validator";
import { Router } from "express";
import {reservDelete, reservGet, reservPost, reservPut } from "./reservation.controller.js";
//import {validarJWT} from "../middlewares/validar-jwt";
import {
    validarFechar,
    validarNumeroHuespedes,
    validarCapacidad,
    validarDisponibilidad,
    existeReservacionById
} from "../helpers/db-validators.js";

import { validarCampos } from "../middlewares/validar-campos.js";
const router = Router();

router.post('/', [
        check("roomId", "El ID de la habitación es obligatorio").not().isEmpty(),
        check("dateStart", "La fecha de inicio es obligatoria").not().isEmpty(),
        check("dateFinish", "La fecha de fin es obligatoria").not().isEmpty(),
        check("huespedes", "El número de huéspedes es obligatorio").not().isEmpty(),
        check("roomId", "El id de la habitacion a reservar es obligatoria").not().isEmpty(),
        validarCampos
], reservPost);

router.get('/', reservGet);

router.put('/:id', 
[
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(existeReservacionById),
    validarCampos
]
, reservPut);

router.delete('/:id', 
[
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(existeReservacionById),
    validarCampos
]
, reservDelete);

export default router;