// src/models/exchangeRates.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const ExchangeRate = sequelize.define("ExchangeRate", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  rate_usd_to_ves: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false 
  },
  active: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  },
  notes: { 
    type: DataTypes.TEXT 
  }
}, {
  tableName: "exchange_rates",
  timestamps: true,
});

export default ExchangeRate;