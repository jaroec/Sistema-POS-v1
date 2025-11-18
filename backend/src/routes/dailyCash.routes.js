import { Router } from "express";
import dailyCashController from "../controllers/dailyCash.controller.js";

const router = Router();

router.get("/current", dailyCashController.getCurrentDailyCash);
router.post("/open", dailyCashController.openDailyCash);
router.post("/close/:id", dailyCashController.closeDailyCash);
router.get("/:id", dailyCashController.getById);
router.get("/", dailyCashController.listDailyCash);

export default router;
