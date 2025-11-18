// ============================================
// PAYMENT ACCOUNTS CONTROLLER
// src/controllers/paymentAccountController.js
// ============================================

import PaymentAccount from "../models/paymentAccounts.model.js";

export default {

  /**
   * GET /payment-accounts
   * Obtener todas las cuentas
   */
  async getAll(req, res) {
    try {
      const accounts = await PaymentAccount.findAll({
        order: [["createdAt", "DESC"]],
      });

      res.json(accounts);

    } catch (error) {
      res.status(500).json({ message: "Error al obtener cuentas", error });
    }
  },

  /**
   * GET /payment-accounts/enabled
   * Para el POS (solo activas)
   */
  async getEnabled(req, res) {
    try {
      const accounts = await PaymentAccount.findAll({
        where: { active: true },
        order: [["method", "ASC"]],
      });

      res.json(accounts);

    } catch (error) {
      res.status(500).json({ message: "Error al obtener cuentas activas", error });
    }
  },

  /**
   * POST /payment-accounts
   * Crear nueva cuenta
   */
  async create(req, res) {
    try {
      const { method, name, bank, account_number, reference_info, active } = req.body;

      if (!method || !name)
        return res.status(400).json({ message: "Método y nombre son obligatorios" });

      const account = await PaymentAccount.create({
        method,
        name,
        bank,
        account_number,
        reference_info,
        active: active ?? true,
      });

      res.json({
        message: "Cuenta creada correctamente",
        account,
      });

    } catch (error) {
      res.status(500).json({ message: "Error al crear cuenta", error });
    }
  },

  /**
   * PUT /payment-accounts/:id
   */
  async update(req, res) {
    try {
      const account = await PaymentAccount.findByPk(req.params.id);

      if (!account)
        return res.status(404).json({ message: "Cuenta no encontrada" });

      await account.update(req.body);

      res.json({ message: "Cuenta actualizada", account });

    } catch (error) {
      res.status(500).json({ message: "Error al actualizar cuenta", error });
    }
  },

  /**
   * PUT /payment-accounts/:id/enable
   */
  async enable(req, res) {
    try {
      const account = await PaymentAccount.findByPk(req.params.id);

      if (!account)
        return res.status(404).json({ message: "Cuenta no encontrada" });

      account.active = !account.active;
      await account.save();

      res.json({
        message: `Cuenta ${account.active ? "activada" : "desactivada"}`,
        account,
      });

    } catch (error) {
      res.status(500).json({ message: "Error al cambiar estado", error });
    }
  },

  /**
   * DELETE /payment-accounts/:id
   */
  async delete(req, res) {
    try {
      const account = await PaymentAccount.findByPk(req.params.id);

      if (!account)
        return res.status(404).json({ message: "Cuenta no encontrada" });

      await account.destroy();

      res.json({ message: "Cuenta eliminada" });

    } catch (error) {
      res.status(500).json({ message: "Error al eliminar cuenta", error });
    }
  },

};
