import { Router } from "express";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { existeHotelById } from "../helpers/db-validators.js";
import { existenteNombreHotel } from "../helpers/db-validators.js";

import {
    hotelPost,
    hotelGet,
    hotelPut,
    hotelDelete,
    getHotelById
} from "./hotel.controller.js";
const router = Router();


router.get("/", hotelGet);

router.post(
    "/",
    [
        validarJWT,
        check("nameHotel", "El nombre es obligatorio").custom(existenteNombreHotel),
        check("address", "La dirreccion es obligatoria").not().isEmpty(),
        check("description", "La descripcion es obligatoria").not().isEmpty(),
        validarCampos,
    ],
    hotelPost
);

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeHotelById),
        validarCampos,
    ],
    hotelPut
);

router.get(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeHotelById),
    ],
    getHotelById
)

router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeHotelById),
    ],
    hotelDelete
)



export default router;