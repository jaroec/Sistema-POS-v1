// src/models/products.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Product = sequelize.define("Product", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  product_code: { 
    type: DataTypes.STRING, 
    unique: true,
    allowNull: false 
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  description: { 
    type: DataTypes.TEXT 
  },
  category: { 
    type: DataTypes.STRING 
  },
  cost_usd: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false 
  },
  profit_percent: { 
    type: DataTypes.DECIMAL(5, 2), 
    allowNull: false 
  },
  sale_price_usd: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false 
  },
  sale_price_ves: { 
    type: DataTypes.DECIMAL(12, 2) 
  },
  stock: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0 
  },
  min_stock: { 
    type: DataTypes.INTEGER, 
    defaultValue: 5 
  }
}, {
  tableName: "products",
  timestamps: true,
});

export default Product;