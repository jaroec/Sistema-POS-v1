import DailyCash from "../models/dailyCash.model.js";
import Sale from "../models/sales.model.js";
import Payment from "../models/payments.model.js";
import { Op } from "sequelize";

export default {

  // 📌 Obtener caja del día
  async getCurrentDailyCash(req, res) {
    const today = new Date().toISOString().split("T")[0];

    const cash = await DailyCash.findOne({ where: { opening_date: today } });

    if (!cash)
      return res.json({ exists: false });

    res.json(cash);
  },

  // 🟢 Abrir caja
  async openDailyCash(req, res) {
    const today = new Date().toISOString().split("T")[0];
    const { opening_amount_usd } = req.body;

    const exists = await DailyCash.findOne({ where: { opening_date: today } });

    if (exists) 
      return res.status(400).json({ message: "La caja ya está abierta hoy" });

    const cash = await DailyCash.create({
      opening_date: today,
      opening_amount_usd,
      status: "open",
    });

    res.json(cash);
  },

  // 🔴 Cerrar caja (recalcula todo automáticamente)
  async closeDailyCash(req, res) {
    const { id } = req.params;
    const cash = await DailyCash.findByPk(id);

    if (!cash) return res.status(404).json({ message: "Caja no encontrada" });
    if (cash.status === "closed")
      return res.status(400).json({ message: "La caja ya está cerrada" });

    // ────────────────────────────────────────────
    // CALCULOS AUTOMÁTICOS
    // ────────────────────────────────────────────
    const today = cash.opening_date;

    // Ventas del día
    const sales = await Sale.findAll({
      where: { created_at: { [Op.gte]: today } }
    });

    const totalCash = sales
      .filter(s => s.sale_type === "cash")
      .reduce((acc, s) => acc + Number(s.total_usd), 0);

    const totalCredit = sales
      .filter(s => s.sale_type === "credit")
      .reduce((acc, s) => acc + Number(s.total_usd), 0);

    // Pagos recibidos de deudas
    const payments = await Payment.findAll({
      where: {
        created_at: { [Op.gte]: today }
      },
    });

    const totalPayments = payments.reduce(
      (acc, p) => acc + Number(p.amount_usd), 
      0
    );

    // Gastos del día
    const expenses = 0; // Puedes luego agregar módulo de gastos

    // MONTOS FINALES
    const closingAmount =
      Number(cash.opening_amount_usd) +
      totalCash +
      totalPayments -
      expenses;

    const difference = closingAmount - cash.closing_amount_usd;

    await cash.update({
      total_sales_cash_usd: totalCash,
      total_sales_credit_usd: totalCredit,
      total_payments_received_usd: totalPayments,
      total_expenses_usd: expenses,
      closing_amount_usd: closingAmount,
      difference_usd: difference,
      status: "closed",
    });

    res.json(cash);
  },

  // 📄 Listado histórico
  async listDailyCash(req, res) {
    const list = await DailyCash.findAll({
      order: [["opening_date", "DESC"]],
    });
    res.json(list);
  },

  async getById(req, res) {
    const cash = await DailyCash.findByPk(req.params.id);
    res.json(cash);
  },
};
