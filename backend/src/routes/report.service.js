import { Op, fn, col, literal, Sequelize } from "sequelize";
import Sales from "../models/sales.model.js";
import SaleItems from "../models/saleItems.model.js";
import Products from "../models/products.model.js";
import Customers from "../models/customers.model.js";
import DailyCash from "../models/dailyCash.model.js";
import Payments from "../models/payments.model.js";

export default {
  // Ventas por rango (agrupa por día)
  async salesByRange(startDate, endDate) {
    const rows = await Sales.findAll({
      where: { createdAt: { [Op.between]: [startDate, endDate] } },
      attributes: [
        [fn("DATE", col("createdAt")), "day"],
        [fn("SUM", col("total_usd")), "total_usd"],
        [fn("COUNT", col("id")), "count"]
      ],
      group: [literal('DATE("Sales"."createdAt")')],
      order: [[literal('DATE("Sales"."createdAt")'), "ASC"]],
      raw: true,
    });

    return rows.map(r => ({ day: r.day, total_usd: Number(r.total_usd), count: Number(r.count) }));
  },

  // Top N productos vendidos (por cantidad) en rango
  async topProducts(startDate, endDate, limit = 10) {
    const rows = await SaleItems.findAll({
      include: [{ model: Products, attributes: ["name", "product_code"] }],
      attributes: [
        "product_id",
        [fn("SUM", col("quantity")), "qty_sold"],
        [fn("SUM", col("subtotal_usd")), "revenue_usd"]
      ],
      where: { createdAt: { [Op.between]: [startDate, endDate] } },
      group: ["product_id", "Product.id"],
      order: [[literal("qty_sold"), "DESC"]],
      limit,
      raw: true,
      nest: true
    });

    return rows.map(r => ({
      product_id: r.product_id,
      product_code: r.Product?.product_code,
      name: r.Product?.name,
      qty_sold: Number(r.qty_sold),
      revenue_usd: Number(r.revenue_usd || 0)
    }));
  },

  // Clientes con mayor consumo y clientes con deuda
  async customerStats(startDate, endDate, limit = 10) {
    const spent = await Sales.findAll({
      where: { createdAt: { [Op.between]: [startDate, endDate] } },
      attributes: ["customer_id", [fn("SUM", col("total_usd")), "total_spent"]],
      group: ["customer_id"],
      order: [[literal("total_spent"), "DESC"]],
      limit,
      raw: true,
    });

    // Clientes con deuda actual (balance > 0)
    const debtRows = await Customers.findAll({
      where: { balance_usd: { [Op.gt]: 0 } },
      attributes: ["id", "name", "balance_usd"],
      order: [["balance_usd", "DESC"]],
      limit,
      raw: true,
    });

    return {
      topSpenders: spent.map(s => ({ customer_id: s.customer_id, total_spent: Number(s.total_spent) })),
      customersWithDebt: debtRows
    };
  },

  // Resumen caja: entre fechas o por día
  async cashSummary(date) {
    // si date es null => día actual
    const day = date || new Date().toISOString().split("T")[0];

    const cash = await DailyCash.findOne({ where: { opening_date: day } });
    if (!cash) return null;

    return {
      opening: Number(cash.opening_amount_usd),
      sales_cash: Number(cash.total_sales_cash_usd),
      sales_credit: Number(cash.total_sales_credit_usd),
      payments: Number(cash.total_payments_received_usd),
      expenses: Number(cash.total_expenses_usd),
      closing: Number(cash.closing_amount_usd),
      difference: Number(cash.difference_usd),
      status: cash.status
    };
  },

  // Reporte general (todo junto)
  async dashboardReport(startDate, endDate) {
    const sales = await this.salesByRange(startDate, endDate);
    const topProducts = await this.topProducts(startDate, endDate, 10);
    const customers = await this.customerStats(startDate, endDate, 10);

    return { sales, topProducts, customers };
  },

  // Export CSV-ready datasets (basic)
  async exportSalesCSV(startDate, endDate) {
    const rows = await Sales.findAll({
      where: { createdAt: { [Op.between]: [startDate, endDate] } },
      include: [{ model: Customers, attributes: ["name"] }],
      order: [["createdAt", "ASC"]],
      raw: true,
      nest: true
    });
    return rows; // frontend puede convertir a CSV
  }
};
