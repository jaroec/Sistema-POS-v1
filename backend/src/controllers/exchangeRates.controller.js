// ============================================
// EXCHANGE RATES CONTROLLER
// src/controllers/exchangeRateController.js
import ExchangeRate from "../models/exchangeRates.model.js";

export default {

  /**
   * GET /exchange-rates
   * Listado completo con historial
   */
  async getAll(req, res) {
    try {
      const rates = await ExchangeRate.findAll({
        order: [["createdAt", "DESC"]],
      });

      res.json(rates);

    } catch (error) {
      res.status(500).json({ message: "Error al obtener tasas", error });
    }
  },

  /**
   * GET /exchange-rates/active
   * Obtener la tasa activa
   */
  async getActive(req, res) {
    try {
      const activeRate = await ExchangeRate.findOne({ where: { active: true } });

      if (!activeRate)
        return res.status(404).json({ message: "No hay tasa activa registrada" });

      res.json(activeRate);

    } catch (error) {
      res.status(500).json({ message: "Error al obtener tasa activa", error });
    }
  },

  /**
   * POST /exchange-rates
   * Registrar nueva tasa del día (solo admin)
   */
  async createRate(req, res) {
    try {
      const { rate_usd_to_ves, notes } = req.body;

      if (!rate_usd_to_ves || rate_usd_to_ves <= 0)
        return res.status(400).json({ message: "La tasa debe ser mayor a 0" });

      // Desactivar la anterior
      await ExchangeRate.update(
        { active: false },
        { where: { active: true } }
      );

      // Crear nueva tasa activa
      const rate = await ExchangeRate.create({
        rate_usd_to_ves,
        active: true,
        notes,
      });

      res.json({
        message: "Nueva tasa registrada",
        rate,
      });

    } catch (error) {
      res.status(500).json({ message: "Error al crear tasa", error });
    }
  },

  /**
   * PUT /exchange-rates/:id/activate
   * Activar una tasa pasada
   */
  async activateRate(req, res) {
    try {
      const id = req.params.id;

      const rate = await ExchangeRate.findByPk(id);
      if (!rate)
        return res.status(404).json({ message: "Tasa no encontrada" });

      // Desactivar actual
      await ExchangeRate.update(
        { active: false },
        { where: { active: true } }
      );

      // Activar seleccionada
      await rate.update({ active: true });

      res.json({ message: "Tasa activada", rate });

    } catch (error) {
      res.status(500).json({ message: "Error al activar tasa", error });
    }
  },

  /**
   * DELETE /exchange-rates/:id
   * Solo permite eliminar tasas que NO sean activas
   */
  async deleteRate(req, res) {
    try {
      const rate = await ExchangeRate.findByPk(req.params.id);

      if (!rate)
        return res.status(404).json({ message: "Tasa no encontrada" });

      if (rate.active)
        return res.status(400).json({ message: "No puedes eliminar la tasa activa" });

      await rate.destroy();

      res.json({ message: "Tasa eliminada correctamente" });

    } catch (error) {
      res.status(500).json({ message: "Error al eliminar tasa", error });
    }
  },

};
