// src/controllers/users.controller.js
import bcrypt from "bcrypt";
import User from "../models/users.model.js";
import { Op } from "sequelize";

export default {
  // ====================================================
  // LISTAR USUARIOS (con paginación opcional)
  // ====================================================
  async getAll(req, res) {
    try {
      const { page = 1, limit = 50, search = "" } = req.query;

      const whereCondition = search
        ? {
            [Op.or]: [
              { name: { [Op.iLike]: `%${search}%` } },
              { username: { [Op.iLike]: `%${search}%` } }
            ]
          }
        : {};

      const users = await User.findAndCountAll({
        where: whereCondition,
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        order: [["createdAt", "DESC"]],
        attributes: { exclude: ['password'] } // No enviar password
      });

      res.json({
        page: Number(page),
        pages: Math.ceil(users.count / limit),
        total: users.count,
        users: users.rows
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
    }
  },

  // ====================================================
  // CREAR USUARIO
  // ====================================================
  async create(req, res) {
    try {
      const { name, username, password, role = "cajero" } = req.body;

      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ message: "El nombre de usuario ya existe" });
      }

      const hashed = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        username,
        password: hashed,
        role,
        active: true,
      });

      res.json({
        message: "Usuario creado correctamente",
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al crear usuario", error: error.message });
    }
  },

  // ====================================================
  // EDITAR USUARIO
  // ====================================================
  async update(req, res) {
    try {
      const { name, username, role } = req.body;
      const user = await User.findByPk(req.params.id);

      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

      // Verificar si el username ya existe (excluyendo el usuario actual)
      if (username && username !== user.username) {
        const existingUser = await User.findOne({ 
          where: { 
            username,
            id: { [Op.ne]: user.id }
          } 
        });
        if (existingUser) {
          return res.status(400).json({ message: "El nombre de usuario ya existe" });
        }
      }

      await user.update({ name, username, role });

      res.json({ 
        message: "Usuario actualizado correctamente",
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar usuario", error: error.message });
    }
  },

  // ====================================================
  // CAMBIAR CONTRASEÑA — Usuario autenticado
  // ====================================================
  async changePassword(req, res) {
    try {
      const { old_password, new_password } = req.body;

      const user = await User.findByPk(req.user.id);

      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

      const valid = await bcrypt.compare(old_password, user.password);

      if (!valid)
        return res.status(400).json({ message: "Contraseña actual incorrecta" });

      const hashed = await bcrypt.hash(new_password, 10);

      await user.update({ password: hashed });

      res.json({ message: "Contraseña actualizada correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al cambiar contraseña", error: error.message });
    }
  },

  // ====================================================
  // ACTIVAR / DESACTIVAR USUARIO
  // ====================================================
  async toggleActive(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user)
        return res.status(404).json({ message: "Usuario no encontrado" });

      await user.update({ active: !user.active });

      res.json({
        message: `Usuario ${user.active ? "activado" : "desactivado"} correctamente`,
        active: user.active
      });
    } catch (error) {
      res.status(500).json({ message: "Error al cambiar estado", error: error.message });
    }
  },

  // ====================================================
  // OBTENER USUARIO POR ID
  // ====================================================
  async getById(req, res) {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] }
      });

      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener usuario", error: error.message });
    }
  },

  // ====================================================
  // ELIMINAR USUARIO
  // ====================================================
  async delete(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

      await user.destroy();

      res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar usuario", error: error.message });
    }
  }
};