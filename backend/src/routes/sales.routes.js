// src/routes/sales.routes.js
import { Router } from "express";
import salesController from "../controllers/sales.controller.js";
import auth from "../middleware/auth.js";
import roles from "../middleware/roles.js";

const router = Router();

/**
 * GET /sales
 * Listado avanzado con filtros, búsqueda y paginación
 */
router.get("/", auth, salesController.getSales);

/**
 * GET /sales/:id
 * Detalle completo de venta
 */
router.get("/:id", auth, salesController.getSaleById);

/**
 * POST /sales
 * Crear una venta completa (POS)
 */
router.post("/", auth, salesController.createSale);

/**
 * PUT /sales/:id/cancel
 * Anular una venta
 */
router.put("/:id/cancel", auth, roles("admin"), salesController.cancelSale);

/**
 * GET /sales/analytics/daily
 * Ventas del día
 */
router.get("/analytics/daily", auth, salesController.getDailySales);

/**
 * GET /sales/analytics/monthly
 * Ventas del mes
 */
router.get("/analytics/monthly", auth, salesController.getMonthlySales);

/**
 * GET /sales/analytics/totals
 * Totales (USD y VES)
 */
router.get("/analytics/totals", auth, salesController.getTotals);

/**
 * GET /sales/analytics/top-products
 */
router.get("/analytics/top-products", auth, salesController.getTopProducts);

/**
 * GET /sales/analytics/top-customers
 */
router.get("/analytics/top-customers", auth, salesController.getTopCustomers);

export default router;
