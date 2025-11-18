// src/routes/paymentAccounts.routes.js
import { Router } from "express";
import paymentAccountsController from "../controllers/paymentAccounts.controller.js";
import auth from "../middleware/auth.js";
import roles from "../middleware/roles.js";

const router = Router();

/**
 * GET /payment-accounts
 * Listado de cuentas de pago
 */
router.get("/", auth, paymentAccountsController.getAll);

/**
 * GET /payment-accounts/enabled
 * Para el POS: solo cuentas activas
 */
router.get("/enabled", auth, paymentAccountsController.getEnabled);

/**
 * POST /payment-accounts
 * Crear cuenta (solo admin)
 */
router.post("/", auth, roles("admin"), paymentAccountsController.create);

/**
 * PUT /payment-accounts/:id
 * Editar cuenta (admin)
 */
router.put("/:id", auth, roles("admin"), paymentAccountsController.update);

/**
 * PUT /payment-accounts/:id/enable
 * Activar/desactivar cuenta
 */
router.put("/:id/enable", auth, roles("admin"), paymentAccountsController.enable);

/**
 * DELETE /payment-accounts/:id
 * Eliminar cuenta (admin)
 */
router.delete("/:id", auth, roles("admin"), paymentAccountsController.delete);

export default router;
