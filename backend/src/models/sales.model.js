// src/models/sales.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Sale = sequelize.define("Sale", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  sale_code: { 
    type: DataTypes.STRING, 
    unique: true,
    allowNull: false 
  },
  customer_id: { 
    type: DataTypes.INTEGER 
  },
  user_id: { 
    type: DataTypes.INTEGER 
  },
  subtotal_usd: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false 
  },
  discount_usd: { 
    type: DataTypes.DECIMAL(10, 2), 
    defaultValue: 0 
  },
  total_usd: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false 
  },
  total_ves: { 
    type: DataTypes.DECIMAL(12, 2), 
    allowNull: false 
  },
  balance_usd: { 
    type: DataTypes.DECIMAL(10, 2), 
    defaultValue: 0 
  },
  balance_ves: { 
    type: DataTypes.DECIMAL(12, 2), 
    defaultValue: 0 
  },
  status: { 
    type: DataTypes.STRING, 
    defaultValue: 'Pendiente' 
  },
  notes: { 
    type: DataTypes.TEXT 
  }
}, {
  tableName: "sales",
  timestamps: true,
});

export default Sale;