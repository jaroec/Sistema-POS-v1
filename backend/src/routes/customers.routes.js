// src/routes/customers.routes.js
import { Router } from "express";
import customersController from "../controllers/customers.controller.js";
import auth from "../middleware/auth.js";
import roles from "../middleware/roles.js";

const router = Router();

/**
 * GET /customers
 * Listado con búsqueda, filtros, paginación
 */
router.get("/", auth, customersController.getCustomers);

/**
 * GET /customers/:id
 */
router.get("/:id", auth, customersController.getCustomerById);

/**
 * POST /customers
 */
router.post("/", auth, roles("admin", "seller"), customersController.createCustomer);

/**
 * PUT /customers/:id
 */
router.put("/:id", auth, roles("admin"), customersController.updateCustomer);

/**
 * DELETE /customers/:id
 */
router.delete("/:id", auth, roles("admin"), customersController.deleteCustomer);

/**
 * GET /customers/:id/sales
 * Historial de compras
 */
router.get("/:id/sales", auth, customersController.getCustomerSales);

/**
 * GET /customers/:id/payments
 * Historial de abonos
 */
router.get("/:id/payments", auth, customersController.getCustomerPayments);

/**
 * POST /customers/:id/pay
 * Realizar abono o cancelar saldo
 */
router.post("/:id/pay", auth, customersController.payCustomerBalance);

/**
 * GET /customers/analytics/top-buyers
 */
router.get("/analytics/top-buyers", auth, customersController.getTopBuyers);

/**
 * GET /customers/analytics/debtors
 * Clientes morosos
 */
router.get("/analytics/debtors", auth, customersController.getDebtors);

/**
 * GET /customers/analytics/solvent
 * Clientes sin deuda
 */
router.get("/analytics/solvent", auth, customersController.getSolventCustomers);

export default router;
