// src/routes/exchangeRates.routes.js
import { Router } from "express";
import exchangeRatesController from "../controllers/exchangeRates.controller.js";
import auth from "../middleware/auth.js";
import roles from "../middleware/roles.js";

const router = Router();

/**
 * GET /exchange-rates
 * Listado de tasas con historial
 */
router.get("/", auth, exchangeRatesController.getAll);

/**
 * GET /exchange-rates/active
 * Obtener la tasa activa
 */
router.get("/active", auth, exchangeRatesController.getActive);

/**
 * POST /exchange-rates
 * Crear nueva tasa del día (admin)
 */
router.post("/", auth, roles("admin"), exchangeRatesController.createRate);

/**
 * PUT /exchange-rates/:id/activate
 * Activar una tasa específica
 */
router.put("/:id/activate", auth, roles("admin"), exchangeRatesController.activateRate);

/**
 * DELETE /exchange-rates/:id
 * Eliminar una tasa (si no está activa)
 */
router.delete("/:id", auth, roles("admin"), exchangeRatesController.deleteRate);

export default router;
