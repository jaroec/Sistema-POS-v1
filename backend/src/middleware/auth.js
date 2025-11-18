// src/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/users.model.js";

// Middleware de autenticación principal
export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Token no proporcionado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Verificar que el usuario aún existe en la base de datos
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    if (!user.active) {
      return res.status(401).json({ message: "Usuario desactivado" });
    }

    req.user = user;
    next();

  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
};

// Middleware para verificar si es administrador
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: "Se requieren privilegios de administrador" });
  }
};

// Exportar por defecto también para compatibilidad
const auth = authenticate;
export default auth;