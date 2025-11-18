// src/models/inventoryMovements.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const InventoryMovement = sequelize.define("InventoryMovement", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  product_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  type: { 
    type: DataTypes.STRING, 
    allowNull: false 
  }, // 'in', 'out', 'adjustment'
  quantity: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  previous_stock: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  new_stock: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  user_id: { 
    type: DataTypes.INTEGER 
  },
  description: { 
    type: DataTypes.TEXT 
  },
  reference: { 
    type: DataTypes.STRING 
  }
}, {
  tableName: "inventory_movements",
  timestamps: true,
});

export default InventoryMovement;