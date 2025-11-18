// ============================================
// INVENTORY CONTROLLER (Optimizado y unificado)
// ============================================

import Product from "../models/products.model.js";
import InventoryMovement from "../models/inventoryMovements.model.js";
import sequelize from "../config/database.js";

export default {

  /** ============================================
   *  GET /inventory/movements
   *  Listado general de movimientos
   *  ============================================ */
  async getAllMovements(req, res) {
    try {
      const movements = await InventoryMovement.findAll({
        include: [
          {
            model: Product,
            attributes: ["id", "product_code", "name", "stock"]
          }
        ],
        order: [["createdAt", "DESC"]],
      });

      res.json(movements);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener movimientos", error });
    }
  },

  /** ============================================
   *  GET /inventory/product/:id
   *  Kardex ordenado de forma cronológica ascendente
   *  ============================================ */
  async getKardex(req, res) {
    try {
      const product_id = req.params.id;

      const movements = await InventoryMovement.findAll({
        where: { product_id },
        include: [
          {
            model: Product,
            attributes: ["id", "product_code", "name", "stock"]
          }
        ],
        order: [["createdAt", "ASC"]], // kardex debe ser ASC
      });

      res.json(movements);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener kardex", error });
    }
  },

  /** ============================================
   *  POST /inventory/entrada
   *  Registrar entrada de inventario
   *  ============================================ */
  async addEntrada(req, res) {
    const t = await sequelize.transaction();

    try {
      const { product_id, quantity, description } = req.body;
      const user_id = req.user?.id || null;

      const product = await Product.findByPk(product_id);

      if (!product)
        return res.status(404).json({ message: "Producto no encontrado" });

      const previous = Number(product.stock);
      const newStock = previous + Number(quantity);

      await product.update({ stock: newStock }, { transaction: t });

      await InventoryMovement.create({
        product_id,
        type: "in",
        quantity,
        previous_stock: previous,
        new_stock: newStock,
        user_id,
        description,
      }, { transaction: t });

      await t.commit();

      res.json({ message: "Entrada registrada", newStock });

    } catch (error) {
      await t.rollback();
      console.error(error);
      res.status(500).json({ message: "Error en entrada", error });
    }
  },

  /** ============================================
   *  POST /inventory/salida
   *  Registrar salida de inventario
   *  ============================================ */
  async addSalida(req, res) {
    const t = await sequelize.transaction();

    try {
      const { product_id, quantity, description } = req.body;
      const user_id = req.user?.id || null;

      const product = await Product.findByPk(product_id);

      if (!product)
        return res.status(404).json({ message: "Producto no encontrado" });

      if (product.stock < quantity)
        return res.status(400).json({ message: "Stock insuficiente" });

      const previous = Number(product.stock);
      const newStock = previous - Number(quantity);

      await product.update({ stock: newStock }, { transaction: t });

      await InventoryMovement.create({
        product_id,
        type: "out",
        quantity,
        previous_stock: previous,
        new_stock: newStock,
        user_id,
        description,
      }, { transaction: t });

      await t.commit();

      res.json({ message: "Salida registrada", newStock });

    } catch (error) {
      await t.rollback();
      console.error(error);
      res.status(500).json({ message: "Error en salida", error });
    }
  },

  /** ============================================
   *  POST /inventory/ajuste
   *  Ajuste manual del stock (cuadre, merma, daño)
   *  ============================================ */
  async addAjuste(req, res) {
    const t = await sequelize.transaction();

    try {
      const { product_id, new_stock, description } = req.body;
      const user_id = req.user?.id || null;

      const product = await Product.findByPk(product_id);

      if (!product)
        return res.status(404).json({ message: "Producto no encontrado" });

      const previous = Number(product.stock);
      const qtyChange = Number(new_stock) - previous;

      await product.update({ stock: new_stock }, { transaction: t });

      await InventoryMovement.create({
        product_id,
        type: "adjustment",
        quantity: qtyChange,
        previous_stock: previous,
        new_stock,
        user_id,
        description,
      }, { transaction: t });

      await t.commit();

      res.json({ message: "Ajuste realizado", new_stock });

    } catch (error) {
      await t.rollback();
      console.error(error);
      res.status(500).json({ message: "Error en ajuste", error });
    }
  },

};
