// src/models/saleItems.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const SaleItem = sequelize.define("SaleItem", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  sale_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  product_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  quantity: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  price_usd: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false 
  },
  subtotal_usd: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false 
  }
}, {
  tableName: "sale_items",
  timestamps: true,
});

export default SaleItem;