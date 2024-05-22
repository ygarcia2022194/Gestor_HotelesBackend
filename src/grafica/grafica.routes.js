import { Router } from "express";
import { obtenerReservacionesPorHabitacion } from "./grafica.controller.js"; 

const router = Router();

router.get("/", obtenerReservacionesPorHabitacion);

export default router;
