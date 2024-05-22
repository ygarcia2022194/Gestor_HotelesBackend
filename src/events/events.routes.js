import { Router } from 'express';
import { check, validationResult } from 'express-validator';
//import { validarJWT } from './middleware/auth.js';
import { validarCampos } from "../middlewares/validar-campos.js";
import { existeEventById } from "../helpers/db-validators.js";


import {
    eventPost,
    eventGet,
    eventPut,
    getEventById,
    deleteEvent
} from './events.controller.js';

const router = Router();

router.get("/", eventGet);

router.post(
    '/',
    [
        check('nameEvent', 'El nombre del evento es obligatorio').not().isEmpty(),
        check('description', 'La descripción del evento es obligatoria').not().isEmpty(),
        check('dateEvent', 'La fecha del evento es obligatoria').not().isEmpty(),
        check('hotelId', 'El ID del hotel es obligatorio').not().isEmpty(),
       // check('serviceId', 'El ID del servicio es obligatorio').not().isEmpty(),
      //  check('userId', 'El ID del usuario es obligatorio').not().isEmpty(),
        validarCampos,
    ],
    eventPost
);

router.put(
    "/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeEventById),
        validarCampos,
    ],
    eventPut
);

router.get(
    "/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeEventById),
    ],
    getEventById
)

router.delete(
    "/:id",
    [

        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeEventById),
    ],
    deleteEvent
)

export default router;