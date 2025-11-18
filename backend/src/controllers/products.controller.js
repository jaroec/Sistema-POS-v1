import Product from "../models/products.model.js";
import SaleItem from "../models/saleItems.model.js";
import ExchangeRate from "../models/exchangeRates.model.js";
import { Op } from "sequelize";

export default {

  // ────────────────────────────────────────────────
  // 📌 LISTAR PRODUCTOS (BUSCAR + PAGINAR + ORDENAR)
  // ────────────────────────────────────────────────
  async getProducts(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        search = "",
        category,
        sortBy = "name",
        order = "ASC",
      } = req.query;

      const where = {};

      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { product_code: { [Op.iLike]: `%${search}%` } },
          { category: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (category) where.category = category;

      const products = await Product.findAndCountAll({
        where,
        order: [[sortBy, order]],
        limit: parseInt(limit),
        offset: (page - 1) * limit,
      });

      res.json({
        total: products.count,
        page: Number(page),
        pages: Math.ceil(products.count / limit),
        items: products.rows,
      });

    } catch (error) {
      res.status(500).json({ 
        message: "Error al obtener productos",
        error 
      });
    }
  },

  // ────────────────────────────────────────────────
  // 📌 OBTENER UN PRODUCTO POR ID
  // ────────────────────────────────────────────────
  async getProductById(req, res) {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) return res.status(404).json({ message: "Producto no encontrado" });
      res.json(product);

    } catch (error) {
      res.status(500).json({ message: "Error al obtener producto" });
    }
  },

  // ────────────────────────────────────────────────
  // ➕ CREAR PRODUCTO (CÁLCULO AUTOMÁTICO)
  // ────────────────────────────────────────────────
  async createProduct(req, res) {
    try {
      const {
        product_code,
        name,
        description,
        category,
        cost_usd,
        profit_percent,
        stock,
        min_stock
      } = req.body;

      // Validaciones
      if (!product_code || !name || !cost_usd || !profit_percent) {
        return res.status(400).json({ message: "Campos obligatorios faltantes" });
      }

      if (profit_percent >= 100) {
        return res.status(400).json({ message: "El % de ganancia no puede ser mayor o igual a 100" });
      }

      const duplicatedCode = await Product.findOne({ where: { product_code } });
      if (duplicatedCode) {
        return res.status(400).json({ message: "El código de producto ya existe" });
      }

      // Tasa actual
      const rateRecord = await ExchangeRate.findOne({
        order: [["createdAt", "DESC"]],
      });

      if (!rateRecord) {
        return res.status(400).json({ message: "No hay tasa registrada" });
      }

      const rate = Number(rateRecord.rate);

      // Calcular el precio automáticamente
      const profit = profit_percent / 100;
      const sale_price_usd = Number(cost_usd / (1 - profit)).toFixed(2);
      const sale_price_ves = Number(sale_price_usd * rate).toFixed(2);

      const product = await Product.create({
        product_code,
        name,
        description,
        category,
        cost_usd,
        profit_percent,
        sale_price_usd,
        sale_price_ves,
        stock,
        min_stock,
      });

      res.json(product);

    } catch (error) {
      res.status(400).json({ 
        message: "Error al crear producto", 
        error 
      });
    }
  },

  // ────────────────────────────────────────────────
  // ✏ ACTUALIZAR PRODUCTO (CÁLCULO AUTOMÁTICO)
  // ────────────────────────────────────────────────
  async updateProduct(req, res) {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) return res.status(404).json({ message: "Producto no encontrado" });

      const {
        product_code,
        name,
        description,
        category,
        cost_usd,
        profit_percent,
        stock,
        min_stock
      } = req.body;

      if (profit_percent && profit_percent >= 100) {
        return res.status(400).json({ message: "El % de ganancia no puede ser mayor o igual a 100" });
      }

      // Tasa actual
      const rateRecord = await ExchangeRate.findOne({
        order: [["createdAt", "DESC"]],
      });

      if (!rateRecord) {
        return res.status(400).json({ message: "No hay tasa registrada" });
      }

      const rate = Number(rateRecord.rate);

      let sale_price_usd = product.sale_price_usd;
      let sale_price_ves = product.sale_price_ves;

      // Si cambió costo o ganancia recalcular
      if (cost_usd || profit_percent) {
        const cost = cost_usd ?? product.cost_usd;
        const profit = (profit_percent ?? product.profit_percent) / 100;

        sale_price_usd = Number(cost / (1 - profit)).toFixed(2);
        sale_price_ves = Number(sale_price_usd * rate).toFixed(2);
      }

      // Guardar cambios
      await product.update({
        product_code,
        name,
        description,
        category,
        cost_usd,
        profit_percent,
        sale_price_usd,
        sale_price_ves,
        stock,
        min_stock,
      });

      res.json(product);

    } catch (error) {
      res.status(400).json({ message: "Error al actualizar producto", error });
    }
  },

  // ────────────────────────────────────────────────
  // ❌ ELIMINAR PRODUCTO
  // ────────────────────────────────────────────────
  async deleteProduct(req, res) {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) return res.status(404).json({ message: "Producto no encontrado" });

      await product.destroy();
      res.json({ message: "Producto eliminado" });

    } catch (error) {
      res.status(500).json({ message: "Error al eliminar producto" });
    }
  },

  // ────────────────────────────────────────────────
  // ⭐ TOP 10 PRODUCTOS MÁS VENDIDOS
  // ────────────────────────────────────────────────
  async getTopSellingProducts(req, res) {
    try {
      const items = await SaleItem.findAll({
        attributes: [
          "product_id",
          [SaleItem.sequelize.fn("SUM", SaleItem.sequelize.col("quantity")), "total_sold"]
        ],
        group: ["product_id", "Product.id"],
        order: [[SaleItem.sequelize.literal("total_sold"), "DESC"]],
        limit: 10,
        include: [Product],
      });

      res.json(items);

    } catch (error) {
      res.status(500).json({ message: "Error al obtener top ventas", error });
    }
  },

  // ────────────────────────────────────────────────
  // ⚠ PRODUCTOS CON STOCK BAJO
  // (Ahora según min_stock real)
  // ────────────────────────────────────────────────
  async getLowStockProducts(req, res) {
    try {
      const products = await Product.findAll({
        where: { 
          stock: { [Op.lte]: Sequelize.col("min_stock") }
        }
      });

      res.json(products);

    } catch (error) {
      res.status(500).json({ message: "Error al obtener stock bajo", error });
    }
  },

};
