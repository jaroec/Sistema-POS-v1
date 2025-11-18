// src/controllers/payments.controller.js
import sequelize from "../config/database.js";
import Payment from "../models/payments.model.js";
import Sale from "../models/sales.model.js";
import Customer from "../models/customers.model.js";
import ExchangeRate from "../models/exchangeRates.model.js";
import PaymentAccount from "../models/paymentAccounts.model.js";
import { Op } from "sequelize";

export default {

  /**
   * GET /payments/sale/:sale_id
   * Historial de pagos de una venta
   */
  async getBySale(req, res) {
    try {
      const payments = await Payment.findAll({
        where: { sale_id: req.params.sale_id },
        include: [PaymentAccount],
        order: [["createdAt", "DESC"]],
      });

      res.json(payments);

    } catch (error) {
      res.status(500).json({ message: "Error al obtener pagos", error });
    }
  },

  /**
   * POST /payments/add
   * Registrar un abono o cancelar una venta parcial
   */
  async addPayment(req, res) {
    const t = await sequelize.transaction();

    try {
      const {
        sale_id,
        method,
        payment_account_id,
        amount_usd = 0,
        amount_ves = 0,
        reference,
      } = req.body;

      if (!sale_id)
        return res.status(400).json({ message: "Debe indicar la venta" });

      const sale = await Sale.findByPk(sale_id);

      if (!sale)
        return res.status(404).json({ message: "Venta no encontrada" });

      if (sale.status === "Anulado")
        return res.status(400).json({ message: "No se puede abonar a una venta anulada" });

      // Obtener tasa activa
      const rate = await ExchangeRate.findOne({ where: { active: true } });
      if (!rate) throw new Error("No hay tasa activa");

      const tasa = parseFloat(rate.rate_usd_to_ves);

      // Convertir pagos VES → USD
      const totalUsdPayment = parseFloat(amount_usd) + (parseFloat(amount_ves) / tasa);

      if (totalUsdPayment <= 0)
        return res.status(400).json({ message: "El pago debe ser mayor a 0" });

      // Validar pago no excedido
      if (totalUsdPayment > sale.balance_usd)
        return res.status(400).json({
          message: `El pago excede el saldo. Saldo actual: ${sale.balance_usd}`,
        });

      // Registrar pago
      const payment = await Payment.create({
        sale_id,
        method,
        payment_account_id,
        amount_usd,
        amount_ves,
        reference,
      }, { transaction: t });

      // Actualizar la venta
      const newBalanceUsd = sale.balance_usd - totalUsdPayment;
      const newBalanceVes = newBalanceUsd * tasa;

      await sale.update({
        balance_usd: newBalanceUsd,
        balance_ves: newBalanceVes,
        status: newBalanceUsd > 0 ? "Crédito" : "Pagado",
      }, { transaction: t });

      // Actualizar saldo del cliente
      if (sale.customer_id) {
        const customer = await Customer.findByPk(sale.customer_id);

        await customer.update({
          balance_usd: customer.balance_usd - totalUsdPayment,
          balance_ves: customer.balance_ves - (totalUsdPayment * tasa),
        }, { transaction: t });
      }

      await t.commit();

      res.json({
        message: "Pago registrado correctamente",
        payment,
        new_balance_usd: newBalanceUsd,
      });

    } catch (error) {
      await t.rollback();
      res.status(500).json({ message: "Error al registrar pago", error: error.message });
    }
  },

  /**
   * GET /payments/customer/:customer_id
   * Historial de pagos por cliente
   */
  async getCustomerPayments(req, res) {
    try {
      const payments = await Payment.findAll({
        include: [Sale],
        where: {
          "$Sale.customer_id$": req.params.customer_id
        },
        order: [["createdAt", "DESC"]],
      });

      res.json(payments);

    } catch (error) {
      res.status(500).json({ message: "Error al obtener historial de cliente", error });
    }
  },

  /**
   * GET /payments
   * Listado general con filtros
   */
  async listPayments(req, res) {
    try {
      const {
        method,
        startDate,
        endDate,
        min,
        max,
        sale_id,
      } = req.query;

      const where = {};

      if (method) where.method = method;
      if (sale_id) where.sale_id = sale_id;

      if (min && max) {
        where.amount_usd = { [Op.between]: [min, max] };
      }

      if (startDate && endDate) {
        where.createdAt = {
          [Op.between]: [startDate, endDate]
        };
      }

      const payments = await Payment.findAll({
        where,
        include: [
          { model: Sale },
          { model: PaymentAccount },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.json(payments);

    } catch (error) {
      res.status(500).json({ message: "Error al listar pagos", error });
    }
  },

};
