// src/routes/users.routes.js

import { Router } from "express";
import usersController from "../controllers/users.controller.js";
import auth from "../middleware/auth.js";
import roles from "../middleware/roles.js";

const router = Router();

// Listado (solo admin y manager)
router.get("/", auth, roles("admin", "manager"), usersController.getAll);

// Crear usuario (solo admin)
router.post("/", auth, roles("admin"), usersController.create);

// Editar usuario (solo admin)
router.put("/:id", auth, roles("admin"), usersController.update);

// Activar / desactivar (solo admin)
router.put("/:id/toggle-active", auth, roles("admin"), usersController.toggleActive);

// Cambiar contraseña (usuario autenticado)
router.put("/change-password/self", auth, usersController.changePassword);

export default router;
