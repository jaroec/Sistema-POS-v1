// ============================================
// INVENTORY ROUTES (Optimizado)
// ============================================

import { Router } from "express";
import inventoryController from "../controllers/inventory.controller.js";
import auth from "../middleware/auth.js";
import roles from "../middleware/roles.js";

const router = Router();

/**
 * Listado general de movimientos
 */
router.get("/movements", auth, inventoryController.getAllMovements);

/**
 * Kardex por producto
 */
router.get("/product/:id", auth, inventoryController.getKardex);

/**
 * Entrada de inventario
 */
router.post("/entrada", auth, roles("admin", "manager"), inventoryController.addEntrada);

/**
 * Salida de inventario
 */
router.post("/salida", auth, roles("admin", "manager"), inventoryController.addSalida);

/**
 * Ajuste de inventario
 */
router.post("/ajuste", auth, roles("admin", "manager"), inventoryController.addAjuste);

export default router;
