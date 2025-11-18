import { Op, fn, col, literal, Sequelize } from "sequelize";
import Sales from "../models/sales.model.js";
import SaleItems from "../models/saleItems.model.js";
import Payments from "../models/payments.model.js";
import Products from "../models/products.model.js";
import Customers from "../models/customers.model.js";

const TODAY = new Date();
const START_OF_DAY = new Date(TODAY.setHours(0, 0, 0, 0));
const END_OF_DAY = new Date(TODAY.setHours(23, 59, 59, 999));

const FIRST_OF_MONTH = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
const NOW = new Date();

export default {

  // ─────────────────────────────────────
  // VENTAS DEL DÍA
  // ─────────────────────────────────────
  async getDayStats() {
    const sales = await Sales.findAll({
      where: {
        createdAt: {
          [Op.between]: [START_OF_DAY, END_OF_DAY],
        },
      },
      attributes: [
        [fn("SUM", col("total_usd")), "total_usd"],
        [fn("SUM", col("total_ves")), "total_ves"],
        [fn("COUNT", col("id")), "count"],
      ],
      raw: true,
    });

    return sales[0] || { total_usd: 0, total_ves: 0, count: 0 };
  },

  // ─────────────────────────────────────
  // VENTAS DEL MES
  // ─────────────────────────────────────
  async getMonthStats() {
    const sales = await Sales.findAll({
      where: {
        createdAt: {
          [Op.between]: [FIRST_OF_MONTH, NOW],
        },
      },
      attributes: [
        [fn("SUM", col("total_usd")), "total_usd"],
        [fn("SUM", col("total_ves")), "total_ves"],
        [fn("COUNT", col("id")), "count"],
      ],
      raw: true,
    });

    // clientes con saldo pendiente
    const customersWithDebt = await Customers.count({
      where: {
        balance_usd: {
          [Op.gt]: 0,
        },
      },
    });

    return {
      ...sales[0],
      customers_with_balance: customersWithDebt
    };
  },

  // ─────────────────────────────────────
  // BAJO STOCK
  // ─────────────────────────────────────
  async getLowStock() {
    return Products.findAll({
      where: {
        stock: { [Op.lte]: col("min_stock") },
      },
      attributes: ["id", "name", "stock", "min_stock"],
      order: [["stock", "ASC"]],
    });
  },

  // ─────────────────────────────────────
  // TOP PRODUCTOS (últimos 30 días)
  // ─────────────────────────────────────
  async getTopProducts() {
    return SaleItems.findAll({
      attributes: [
        "product_id",
        [fn("SUM", col("quantity")), "quantity"],
      ],
      include: [
        {
          model: Products,
          attributes: ["name"],
        },
      ],
      group: ["product_id", "Product.id"],
      order: [[literal("quantity"), "DESC"]],
      limit: 5,
    });
  },

  // ─────────────────────────────────────
  // VENTAS 7 DÍAS (GRÁFICO)
  // ─────────────────────────────────────
  async getWeeklySales() {
    const today = new Date();
    const sevenDaysAgo = new Date(new Date().setDate(today.getDate() - 6));

    const data = await Sales.findAll({
      where: {
        createdAt: { [Op.between]: [sevenDaysAgo, today] },
      },
      attributes: [
        [fn("DATE", col("createdAt")), "day"],
        [fn("SUM", col("total_usd")), "total"],
      ],
      group: [literal("DATE(\"Sales\".\"createdAt\")")],
      order: [[literal("DATE(\"Sales\".\"createdAt\")"), "ASC"]],
      raw: true,
    });

    return data.map((d) => ({
      label: d.day,
      total: Number(d.total),
    }));
  },

  // ─────────────────────────────────────
  // MÉTODOS DE PAGO MÁS USADOS
  // ─────────────────────────────────────
  async getPaymentMethodStats() {
    const data = await Payments.findAll({
      attributes: [
        "method",
        [fn("SUM", col("amount_usd")), "total_usd"],
      ],
      group: ["method"],
      order: [[literal("total_usd"), "DESC"]],
      raw: true,
    });

    return data.map((p) => ({
      method: p.method,
      total: Number(p.total_usd),
    }));
  },

  // ─────────────────────────────────────
  // ÚLTIMAS VENTAS
  // ─────────────────────────────────────
  async getRecentSales() {
    return Sales.findAll({
      limit: 10,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Customers,
          attributes: ["name"],
        },
      ],
    });
  },
};
