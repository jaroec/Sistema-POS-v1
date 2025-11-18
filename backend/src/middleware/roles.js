// src/middleware/roles.js

export default function roles(...allowedRoles) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const userRoles = req.user.roles || [];

      // ¿El usuario tiene al menos uno de los roles permitidos?
      const hasRole = userRoles.some((r) => allowedRoles.includes(r));

      if (!hasRole) {
        return res.status(403).json({ message: "No tienes permisos suficientes" });
      }

      next();
    } catch (err) {
      res.status(500).json({ message: "Error en validación de roles", error: err });
    }
  };
}
