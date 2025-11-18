import { Router } from "express";
import reportController from "../controllers/report.controller.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get("/sales-range", auth, reportController.salesByRange);
router.get("/top-products", auth, reportController.topProducts);
router.get("/customers-stats", auth, reportController.customerStats);
router.get("/cash-summary", auth, reportController.cashSummary);
router.get("/dashboard", auth, reportController.dashboardReport);
router.get("/export/sales", auth, reportController.exportSalesCSV);

export default router;
