import { Router } from "express";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";


import {
    roomPost,
    getRooms,
    roomPut,
    roomDelete,
    getRoomById,
    getRoomsByHotel
} from "./room.controller.js";
const router = Router();


router.get("/", getRooms);

router.post(
    "/",
    [
        validarJWT,
        check("description", "La descripcion es obligatorio").not().isEmpty(),
        check("peopleCapacity", "La capacidad de personas es obligatoria").not().isEmpty(),
        check("priceRoom", "El precio es obligatorio").not().isEmpty(),
        check("typeRoom", "El tipo de habitacion es de caracter obligatorio").not().isEmpty(),
        check("hotelId", "El id del hotel es obligatorio").not().isEmpty(),
        validarCampos,
    ],
    roomPost
);

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        //check("id").custom(existeProductoById),
        validarCampos,
    ],
    roomPut
);

router.get(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        //check("id").custom(existeProductoById),
    ],
    getRoomById
)


router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        //check("id").custom(existeProductoById),
    ],
    roomDelete
)

router.get("/name",getRoomsByHotel)

export default router;