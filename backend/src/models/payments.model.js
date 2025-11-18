// src/models/payments.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Payment = sequelize.define("Payment", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  sale_id: { 
    type: DataTypes.INTEGER 
  },
  customer_id: { 
    type: DataTypes.INTEGER 
  },
  method: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  amount_usd: { 
    type: DataTypes.DECIMAL(10, 2), 
    defaultValue: 0 
  },
  amount_ves: { 
    type: DataTypes.DECIMAL(12, 2), 
    defaultValue: 0 
  },
  reference: { 
    type: DataTypes.STRING 
  },
  payment_account_id: { 
    type: DataTypes.INTEGER 
  }
}, {
  tableName: "payments",
  timestamps: true,
});

export default Payment;