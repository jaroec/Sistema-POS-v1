import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const PaymentAccount = sequelize.define("PaymentAccount", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  method: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  bank: { 
    type: DataTypes.STRING 
  },
  account_number: { 
    type: DataTypes.STRING 
  },
  reference_info: { 
    type: DataTypes.TEXT 
  },
  active: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  }
}, {
  tableName: "payment_accounts",
  timestamps: true,
});

export default PaymentAccount;