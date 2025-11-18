import { Router } from "express";
import auth from "../middleware/auth.js";
import productController from "../controllers/products.controller.js";

const router = Router();

// Listado con paginación + búsqueda + filtros
router.get("/", auth, productController.getProducts);

// Obtener por ID
router.get("/:id", auth, productController.getProductById);

// Crear producto
router.post("/", auth, productController.createProduct);

// Editar producto
router.put("/:id", auth, productController.updateProduct);

// Eliminar producto
router.delete("/:id", auth, productController.deleteProduct);

// Top productos más vendidos
router.get("/stats/top-selling", auth, productController.getTopSellingProducts);

// Productos con bajo stock
router.get("/stats/low-stock", auth, productController.getLowStockProducts);

export default router;
