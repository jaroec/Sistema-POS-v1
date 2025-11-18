// ============================================
// SALES CONTROLLER
// src/controllers/saleController.js
// ============================================

import sequelize from "../config/sequelize.js"; // ← CAMBIO AQUÍ
import Sale from "../models/sales.model.js";
import SaleItem from "../models/saleItems.model.js";
import Payment from "../models/payments.model.js";
import Product from "../models/products.model.js";
import Customer from "../models/customers.model.js";
import ExchangeRate from "../models/exchangeRates.model.js";
import InventoryMovement from "../models/inventoryMovements.model.js";
import { Op } from "sequelize";

export default {

  /**
   * POST /sales — crear venta POS (CON INVENTARIO AUTOMÁTICO)
   */
  async createSale(req, res) {
    const t = await sequelize.transaction();

    try {
      const {
        customer_id,
        items,
        payments,
        discount_usd = 0,
        notes = "",
        user_id,
      } = req.body;

      if (!items || items.length === 0)
        return res.status(400).json({ message: "La venta debe tener productos" });

      // 1️⃣ Obtener tasa activa
      const activeRate = await ExchangeRate.findOne({ where: { active: true } });
      if (!activeRate) throw new Error("No hay tasa activa registrada");

      const rate = parseFloat(activeRate.rate_usd_to_ves);

      // 2️⃣ Calcular subtotal
      let subtotal_usd = 0;
      for (const item of items)
        subtotal_usd += item.quantity * item.price_usd;

      const total_usd = subtotal_usd - discount_usd;
      const total_ves = total_usd * rate;

      // 3️⃣ Crear venta
      const sale = await Sale.create({
        sale_code: "S-" + Date.now(),
        customer_id,
        user_id,
        subtotal_usd,
        discount_usd,
        total_usd,
        total_ves,
        balance_usd: total_usd,
        balance_ves: total_ves,
        notes,
      }, { transaction: t });

      // 4️⃣ Registrar ítems, descontar stock y crear movimiento en inventario
      for (const item of items) {

        const product = await Product.findByPk(item.product_id, {
          lock: t.LOCK.UPDATE,
          transaction: t
        });

        if (!product)
          throw new Error(`Producto no encontrado: ${item.product_id}`);

        if (product.stock < item.quantity)
          throw new Error(`Stock insuficiente para ${product.name}`);

        const previous = Number(product.stock);
        const newStock = previous - Number(item.quantity);

        // Crear item de venta
        await SaleItem.create({
          sale_id: sale.id,
          product_id: product.id,
          quantity: item.quantity,
          price_usd: item.price_usd,
          subtotal_usd: item.quantity * item.price_usd,
        }, { transaction: t });

        // Actualizar stock
        await product.update({
          stock: newStock
        }, { transaction: t });

        // Kardex (salida)
        await InventoryMovement.create({
          product_id: product.id,
          type: "out",
          quantity: item.quantity,
          previous_stock: previous,
          new_stock: newStock,
          description: "Salida automática por venta",
          reference: sale.sale_code,
          user_id
        }, { transaction: t });

      }

      // 5️⃣ Registrar pagos
      let totalPaidUsd = 0;
      let totalPaidVes = 0;

      for (const p of payments) {
        totalPaidUsd += Number(p.amount_usd || 0);
        totalPaidVes += Number(p.amount_ves || 0);

        await Payment.create({
          sale_id: sale.id,
          method: p.method,
          amount_usd: p.amount_usd || 0,
          amount_ves: p.amount_ves || 0,
          reference: p.reference || null,
          payment_account_id: p.payment_account_id,
        }, { transaction: t });
      }

      const paidTotalUSD = totalPaidUsd + totalPaidVes / rate;

      // 6️⃣ Estado y balances
      const remainingUsd = total_usd - paidTotalUSD;
      const remainingVes = remainingUsd * rate;

      await sale.update({
        balance_usd: remainingUsd < 0 ? 0 : remainingUsd,
        balance_ves: remainingVes < 0 ? 0 : remainingVes,
        status: remainingUsd > 0 ? "Crédito" : "Pagado",
      }, { transaction: t });

      // 7️⃣ Actualizar saldo del cliente (si quedó debiendo)
      if (customer_id && remainingUsd > 0) {
        const cust = await Customer.findByPk(customer_id, { transaction: t });

        await cust.update({
          balance_usd: Number(cust.balance_usd) + remainingUsd,
          balance_ves: Number(cust.balance_ves) + remainingVes,
        }, { transaction: t });
      }

      await t.commit();

      res.json({
        message: "Venta creada con éxito",
        sale_id: sale.id,
      });

    } catch (error) {
      await t.rollback();
      console.error(error);
      res.status(500).json({
        message: "Error al crear venta",
        error: error.message
      });
    }
  },

  // =====================================================================
  //  RESTO DE LOS MÉTODOS (getSales, getSaleById, cancelSale, reportes)
  // =====================================================================
  async getSales(req, res) { 
    try {
      const sales = await Sale.findAll({
        include: [
          { model: Customer },
          { model: SaleItem, include: [Product] },
          { model: Payment }
        ],
        order: [['createdAt', 'DESC']]
      });
      res.json(sales);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getSaleById(req, res) { 
    try {
      const { id } = req.params;
      const sale = await Sale.findByPk(id, {
        include: [
          { model: Customer },
          { model: SaleItem, include: [Product] },
          { model: Payment }
        ]
      });
      if (!sale) return res.status(404).json({ message: "Venta no encontrada" });
      res.json(sale);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async cancelSale(req, res) { 
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { reason, user_id } = req.body;

      const sale = await Sale.findByPk(id, { transaction: t });
      if (!sale) return res.status(404).json({ message: "Venta no encontrada" });

      if (sale.status === "Anulado") 
        return res.status(400).json({ message: "La venta ya está anulada" });

      // Revertir inventario
      const saleItems = await SaleItem.findAll({ 
        where: { sale_id: id },
        include: [Product],
        transaction: t 
      });

      for (const item of saleItems) {
        const product = item.Product;
        const previous = Number(product.stock);
        const newStock = previous + Number(item.quantity);

        // Revertir stock
        await product.update({ stock: newStock }, { transaction: t });

        // Kardex (entrada por anulación)
        await InventoryMovement.create({
          product_id: product.id,
          type: "in",
          quantity: item.quantity,
          previous_stock: previous,
          new_stock: newStock,
          description: `Entrada por anulación de venta: ${reason || "Sin motivo"}`,
          reference: sale.sale_code,
          user_id
        }, { transaction: t });
      }

      // Revertir saldo del cliente si tenía crédito
      if (sale.customer_id && sale.balance_usd > 0) {
        const cust = await Customer.findByPk(sale.customer_id, { transaction: t });
        await cust.update({
          balance_usd: Number(cust.balance_usd) - sale.balance_usd,
          balance_ves: Number(cust.balance_ves) - sale.balance_ves,
        }, { transaction: t });
      }

      // Anular venta
      await sale.update({ 
        status: "Anulado",
        notes: sale.notes + ` [ANULADA: ${reason || "Sin motivo"}]`
      }, { transaction: t });

      await t.commit();
      res.json({ message: "Venta anulada correctamente" });

    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: error.message });
    }
  },

  async getDailySales(req, res) { 
    try {
      const { date } = req.query;
      const targetDate = date ? new Date(date) : new Date();
      
      const startDate = new Date(targetDate.setHours(0, 0, 0, 0));
      const endDate = new Date(targetDate.setHours(23, 59, 59, 999));

      const sales = await Sale.findAll({
        where: {
          createdAt: { [Op.between]: [startDate, endDate] },
          status: { [Op.ne]: "Anulado" }
        },
        include: [Customer, { model: SaleItem, include: [Product] }, Payment]
      });

      const total = sales.reduce((sum, sale) => sum + parseFloat(sale.total_usd), 0);
      
      res.json({ sales, total: total.toFixed(2), count: sales.length });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getMonthlySales(req, res) { 
    try {
      const { year, month } = req.query;
      const targetYear = parseInt(year) || new Date().getFullYear();
      const targetMonth = parseInt(month) || new Date().getMonth() + 1;

      const startDate = new Date(targetYear, targetMonth - 1, 1);
      const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

      const sales = await Sale.findAll({
        where: {
          createdAt: { [Op.between]: [startDate, endDate] },
          status: { [Op.ne]: "Anulado" }
        },
        include: [Customer]
      });

      const total = sales.reduce((sum, sale) => sum + parseFloat(sale.total_usd), 0);
      
      res.json({ 
        sales, 
        total: total.toFixed(2), 
        count: sales.length,
        period: `${targetMonth}/${targetYear}`
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getTotals(req, res) { 
    try {
      const totalSales = await Sale.count({ where: { status: { [Op.ne]: "Anulado" } } });
      const totalRevenue = await Sale.sum('total_usd', { where: { status: { [Op.ne]: "Anulado" } } });
      const pendingCredit = await Sale.sum('balance_usd', { where: { status: "Crédito" } });

      res.json({
        totalSales,
        totalRevenue: totalRevenue ? parseFloat(totalRevenue).toFixed(2) : "0.00",
        pendingCredit: pendingCredit ? parseFloat(pendingCredit).toFixed(2) : "0.00"
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getTopProducts(req, res) { 
    try {
      const { limit = 10 } = req.query;
      
      const topProducts = await SaleItem.findAll({
        attributes: [
          'product_id',
          [sequelize.fn('SUM', sequelize.col('quantity')), 'totalSold'],
          [sequelize.fn('SUM', sequelize.col('subtotal_usd')), 'totalRevenue']
        ],
        include: [Product],
        group: ['product_id', 'Product.id'],
        order: [[sequelize.fn('SUM', sequelize.col('quantity')), 'DESC']],
        limit: parseInt(limit)
      });

      res.json(topProducts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getTopCustomers(req, res) { 
    try {
      const { limit = 10 } = req.query;
      
      const topCustomers = await Sale.findAll({
        attributes: [
          'customer_id',
          [sequelize.fn('COUNT', sequelize.col('id')), 'totalPurchases'],
          [sequelize.fn('SUM', sequelize.col('total_usd')), 'totalSpent']
        ],
        include: [Customer],
        where: { status: { [Op.ne]: "Anulado" } },
        group: ['customer_id', 'Customer.id'],
        order: [[sequelize.fn('SUM', sequelize.col('total_usd')), 'DESC']],
        limit: parseInt(limit)
      });

      res.json(topCustomers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


};
