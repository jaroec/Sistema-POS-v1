// src/services/inventory.service.js
import StockMovement from "../models/stockMovement.model.js";
import Product from "../models/products.model.js";

export default {
  /**
   * Crea un movimiento y actualiza stock en transacción.
   * payload: { product_id, type, quantity, note, reference, userId }
   */
  async createMovement(payload) {
    const { product_id, type, quantity, note, reference, userId } = payload;
    if (!product_id || !type || !Number.isFinite(Number(quantity))) {
      throw new Error("Campos requeridos: product_id, type, quantity");
    }

    const qty = Number(quantity);
    if (qty <= 0) throw new Error("La cantidad debe ser mayor a cero");

    const t = await Product.sequelize.transaction();
    try {
      const product = await Product.findByPk(product_id, { transaction: t, lock: t.LOCK.UPDATE });
      if (!product) throw new Error("Producto no encontrado");

      // calcular nuevo stock
      let newStock;
      if (type === "in" || type === "adjustment") {
        newStock = Number(product.stock) + qty;
      } else if (type === "out") {
        newStock = Number(product.stock) - qty;
        if (newStock < 0) {
          throw new Error("Movimiento produciría stock negativo");
        }
      } else {
        throw new Error("Tipo inválido (in/out/adjustment)");
      }

      // actualizar producto
      await product.update({ stock: newStock }, { transaction: t });

      // crear movimiento
      const mov = await StockMovement.create(
        {
          product_id,
          type,
          quantity: qty,
          note: note || null,
          reference: reference || null,
          created_by: userId || null,
        },
        { transaction: t }
      );

      await t.commit();

      // incluir producto en respuesta
      const movWithProduct = await StockMovement.findByPk(mov.id, { include: [{ model: Product, as: "Product" }] });
      return movWithProduct;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  /**
   * Listar movimientos (opcional por producto)
   */
  async listMovements(productId = null, limit = 200) {
    const where = {};
    if (productId) where.product_id = productId;

    const rows = await StockMovement.findAll({
      where,
      include: [{ model: Product, as: "Product", attributes: ["id", "product_code", "name"] }],
      order: [["createdAt", "DESC"]],
      limit: Number(limit) || 200,
    });

    return rows;
  },

  /**
   * Kardex: lista cronológica asc y saldo acumulado
   */
  async kardex(productId) {
    if (!productId) throw new Error("productId requerido");

    const product = await Product.findByPk(productId);
    if (!product) throw new Error("Producto no encontrado");

    const rows = await StockMovement.findAll({
      where: { product_id: productId },
      order: [["createdAt", "ASC"]],
      raw: true,
    });

    let balance = 0;
    const entries = rows.map((r) => {
      const qty = Number(r.quantity);
      if (r.type === "in" || r.type === "adjustment") balance += qty;
      else balance -= qty;

      return {
        id: r.id,
        date: r.createdAt,
        type: r.type,
        quantity: qty,
        reference: r.reference,
        note: r.note,
        balance,
      };
    });

    return { product: { id: product.id, product_code: product.product_code, name: product.name }, entries };
  },
};
