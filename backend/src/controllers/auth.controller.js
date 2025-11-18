// src/controllers/auth.controller.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/users.model.js";

export default {
  /**
   * POST /auth/login
   */
  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Usuario y contraseña son requeridos" });
      }

      const user = await User.findOne({ where: { username } });

      if (!user)
        return res.status(404).json({ message: "Usuario no encontrado" });

      if (!user.active)
        return res.status(403).json({ message: "Usuario desactivado" });

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword)
        return res.status(400).json({ message: "Contraseña incorrecta" });

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          role: user.role
        },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: "8h" }
      );

      res.json({
        message: "Login exitoso",
        token,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role,
          active: user.active
        }
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
    }
  },

  /**
   * POST /auth/register
   */
  async register(req, res) {
    try {
      const { name, username, password, role = 'cajero' } = req.body;

      if (!name || !username || !password) {
        return res.status(400).json({ message: "Nombre, usuario y contraseña son requeridos" });
      }

      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ message: "El nombre de usuario ya existe" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        username,
        password: hashedPassword,
        role,
        active: true
      });

      res.status(201).json({
        message: "Usuario creado exitosamente",
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role
        }
      });

    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ message: "Error al crear usuario", error: error.message });
    }
  },

  /**
   * GET /auth/me
   */
  async me(req, res) {
    try {
      // El usuario ya está en req.user por el middleware authenticate
      const user = req.user;

      res.json({
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role,
          active: user.active,
          createdAt: user.createdAt
        }
      });

    } catch (error) {
      console.error('Error en me:', error);
      res.status(500).json({ message: "Error al obtener información del usuario", error: error.message });
    }
  }
};
