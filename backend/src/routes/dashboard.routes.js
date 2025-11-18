import { Router } from "express";
import auth from "../middleware/auth.js";
import dashboardController from "../controllers/dashboard.controller.js";

const router = Router();

// Estadísticas del día
router.get("/stats/day", auth, dashboardController.getDayStats);

// Estadísticas del mes
router.get("/stats/month", auth, dashboardController.getMonthStats);

// Productos con bajo stock
router.get("/low-stock", auth, dashboardController.getLowStock);

// Top productos
router.get("/top-products", auth, dashboardController.getTopProducts);

// Ventas 7 días
router.get("/stats/weekly", auth, dashboardController.getWeeklySales);

// Métodos de pago
router.get("/stats/methods", auth, dashboardController.getPaymentMethods);

// Últimas ventas
router.get("/latest", auth, dashboardController.getRecentSales);

export default router;
