import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const DailyCash = sequelize.define("DailyCash", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  opening_date: { 
    type: DataTypes.DATEONLY, 
    allowNull: false,
    unique: true 
  },
  opening_amount_usd: { 
    type: DataTypes.DECIMAL(10, 2), 
    defaultValue: 0 
  },
  total_sales_cash_usd: { 
    type: DataTypes.DECIMAL(10, 2), 
    defaultValue: 0 
  },
  total_sales_credit_usd: { 
    type: DataTypes.DECIMAL(10, 2), 
    defaultValue: 0 
  },
  total_payments_received_usd: { 
    type: DataTypes.DECIMAL(10, 2), 
    defaultValue: 0 
  },
  total_expenses_usd: { 
    type: DataTypes.DECIMAL(10, 2), 
    defaultValue: 0 
  },
  closing_amount_usd: { 
    type: DataTypes.DECIMAL(10, 2), 
    defaultValue: 0 
  },
  difference_usd: { 
    type: DataTypes.DECIMAL(10, 2), 
    defaultValue: 0 
  },
  status: { 
    type: DataTypes.STRING, 
    defaultValue: 'open' 
  } // 'open', 'closed'
}, {
  tableName: "daily_cash",
  timestamps: true,
});

export default DailyCash;