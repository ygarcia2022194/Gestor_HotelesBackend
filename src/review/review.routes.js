import { check } from "express-validator";
import { Router } from "express";
import { postReview } from "./review.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post('/',
    [
        validarJWT,
        check('comment', 'El comentario de la opinion es obligatoria').not().isEmpty(),
        check('raitingClean', 'El raiting de la limpieza es obligatioria').not().isEmpty(),
        check('raitingStaff', 'El raiting del personal es obligatorio').not().isEmpty(),
        check('raitingAttention', 'El raiting de la atencion al cliente es obligatorio').not().isEmpty(),
        check('hotel', 'El id del hotel es obligatorio').not().isEmpty(),
    ], postReview);