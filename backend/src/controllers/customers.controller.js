import Customer from "../models/customers.model.js";
import Sale from "../models/sales.model.js";
import Payment from "../models/payments.model.js";
import { Op } from "sequelize";
import sequelize from "../config/database.js";

export default {

  // 📌 LISTADO AVANZADO DE CLIENTES
  async getCustomers(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        search = "",
        minDebt,
        maxDebt,
        sortBy = "name",
        order = "ASC",
      } = req.query;

      const where = {};

      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { phone: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (minDebt) where.balance_usd = { [Op.gte]: minDebt };
      if (maxDebt) where.balance_usd = { [Op.lte]: maxDebt };

      const customers = await Customer.findAndCountAll({
        where,
        limit,
        offset: (page - 1) * limit,
        order: [[sortBy, order]],
      });

      res.json({
        total: customers.count,
        items: customers.rows,
        page: parseInt(page),
        pages: Math.ceil(customers.count / limit)
      });

    } catch (error) {
      res.status(500).json({ message: "Error al obtener clientes", error });
    }
  },

  // 📌 OBTENER CLIENTE POR ID
  async getCustomerById(req, res) {
    try {
      const customer = await Customer.findByPk(req.params.id);

      if (!customer) return res.status(404).json({ message: "Cliente no encontrado" });

      res.json(customer);

    } catch (error) {
      res.status(500).json({ message: "Error al obtener el cliente", error });
    }
  },

  // ➕ CREAR CLIENTE
  async createCustomer(req, res) {
    try {
      const customer = await Customer.create(req.body);
      res.json(customer);

    } catch (error) {
      res.status(400).json({ message: "Error al crear cliente", error });
    }
  },

  // ✏ ACTUALIZAR CLIENTE
  async updateCustomer(req, res) {
    try {
      const customer = await Customer.findByPk(req.params.id);
      if (!customer) return res.status(404).json({ message: "Cliente no encontrado" });

      await customer.update(req.body);
      res.json(customer);

    } catch (error) {
      res.status(400).json({ message: "Error al actualizar", error });
    }
  },

  // ❌ ELIMINAR CLIENTE
  async deleteCustomer(req, res) {
    try {
      const customer = await Customer.findByPk(req.params.id);
      if (!customer) return res.status(404).json({ message: "Cliente no encontrado" });

      await customer.destroy();
      res.json({ message: "Cliente eliminado" });

    } catch (error) {
      res.status(500).json({ message: "Error al eliminar", error });
    }
  },

  // 🧾 HISTORIAL DE COMPRAS
  async getCustomerSales(req, res) {
    try {
      const sales = await Sale.findAll({
        where: { customer_id: req.params.id },
        order: [["createdAt", "DESC"]],
      });

      res.json(sales);

    } catch (error) {
      res.status(500).json({ message: "Error al obtener historial", error });
    }
  },

  // 💳 HISTORIAL DE ABONOS
  async getCustomerPayments(req, res) {
    try {
      const payments = await Payment.findAll({
        where: { customer_id: req.params.id },
        order: [["createdAt", "DESC"]],
      });

      res.json(payments);

    } catch (error) {
      res.status(500).json({ message: "Error al obtener pagos", error });
    }
  },

  // 💵 PAGAR CUENTA PENDIENTE (ABONO)
  async payCustomerBalance(req, res) {
    const t = await sequelize.transaction();

    try {
      const { amount_usd, amount_ves, reference, method, payment_account_id } = req.body;

      const customer = await Customer.findByPk(req.params.id);
      if (!customer) return res.status(404).json({ message: "Cliente no encontrado" });

      // REGISTRA EL PAGO
      const payment = await Payment.create({
        customer_id: customer.id,
        amount_usd,
        amount_ves,
        reference,
        method,
        payment_account_id,
      }, { transaction: t });

      // ACTUALIZA BALANCE DEL CLIENTE
      const newBalanceUsd = parseFloat(customer.balance_usd) - parseFloat(amount_usd);
      const newBalanceVes = parseFloat(customer.balance_ves) - parseFloat(amount_ves);

      await customer.update({
        balance_usd: newBalanceUsd < 0 ? 0 : newBalanceUsd,
        balance_ves: newBalanceVes < 0 ? 0 : newBalanceVes,
      }, { transaction: t });

      await t.commit();

      res.json({ message: "Pago registrado", payment });

    } catch (error) {
      await t.rollback();
      res.status(500).json({ message: "Error al abonar saldo", error });
    }
  },

  // ⭐ TOP CLIENTES QUE MÁS COMPRAN
  async getTopBuyers(req, res) {
    try {
      const buyers = await Sale.findAll({
        attributes: [
          "customer_id",
          [Sale.sequelize.fn("SUM", Sale.sequelize.col("total_usd")), "spent"]
        ],
        group: ["customer_id"],
        order: [[Sale.sequelize.literal("spent"), "DESC"]],
        limit: 10,
        include: [
          { model: Customer }
        ],
      });

      res.json(buyers);

    } catch (error) {
      res.status(500).json({ message: "Error al obtener top clientes", error });
    }
  },

  // ⚠️ CLIENTES MOROSOS
  async getDebtors(req, res) {
    try {
      const customers = await Customer.findAll({
        where: { balance_usd: { [Op.gt]: 0 } },
      });

      res.json(customers);

    } catch (error) {
      res.status(500).json({ message: "Error al obtener deudores", error });
    }
  },

  // ✔ CLIENTES SOLVENTES
  async getSolventCustomers(req, res) {
    try {
      const customers = await Customer.findAll({
        where: { balance_usd: 0 },
      });

      res.json(customers);

    } catch (error) {
      res.status(500).json({ message: "Error al obtener solventes", error });
    }
  },

};
