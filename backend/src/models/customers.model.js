// src/models/customers.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js"; // ← CAMBIO AQUÍ

const Customer = sequelize.define("Customer", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  name: { type: DataTypes.STRING, allowNull: false },

  phone: { type: DataTypes.STRING },

  email: { type: DataTypes.STRING },

  address: { type: DataTypes.STRING },

  credit_limit: {
    type: DataTypes.DECIMAL,
    defaultValue: 0,
  },

  balance_usd: {
    type: DataTypes.DECIMAL,
    defaultValue: 0,
  },

  balance_ves: {
    type: DataTypes.DECIMAL,
    defaultValue: 0,
  },

}, {
  tableName: "customers",
  timestamps: true,
});

export default Customer;
