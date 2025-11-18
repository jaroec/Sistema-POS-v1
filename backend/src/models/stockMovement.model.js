// src/models/stockMovement.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import Product from "./products.model.js";

const StockMovement = sequelize.define(
  "StockMovement",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    type: {
      type: DataTypes.ENUM("in", "out", "adjustment"),
      allowNull: false,
    },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    note: { type: DataTypes.TEXT, allowNull: true },
    reference: { type: DataTypes.STRING, allowNull: true }, // factura, orden de compra, motivo
    created_by: { type: DataTypes.INTEGER, allowNull: true }, // user id
  },
  {
    tableName: "stock_movements",
    timestamps: true,
  }
);

// asociación para que al consultar movimiento podamos incluir Product
StockMovement.belongsTo(Product, { foreignKey: "product_id", as: "Product" });

export default StockMovement;
