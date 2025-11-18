// src/routes/payments.routes.js
import { Router } from "express";
import paymentsController from "../controllers/payments.controller.js";
import auth from "../middleware/auth.js";

const router = Router();

/**
 * GET /payments/sale/:sale_id
 * Obtener historial de pagos de una venta
 */
router.get("/sale/:sale_id", auth, paymentsController.getBySale);

/**
 * POST /payments/add
 * Registrar un abono (pago parcial o cancelación)
 */
router.post("/add", auth, paymentsController.addPayment);

/**
 * GET /payments/customer/:customer_id
 * Historial de todos los pagos de un cliente
 */
router.get("/customer/:customer_id", auth, paymentsController.getCustomerPayments);

/**
 * GET /payments
 * Listado general con filtros
 */
router.get("/", auth, paymentsController.listPayments);

export default router;
