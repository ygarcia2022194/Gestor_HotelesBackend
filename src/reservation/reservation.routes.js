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

router.post("/:roomId", [
    check("dateStart", "La fecha de inicio es obligatoria").not().isEmpty(),
    check("dateFinish", "La fecha de fin es obligatoria").not().isEmpty(),
    check("listService", "La lista de servicios utilizados es obligatoria").not().isEmpty(),
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