// src/models/roles.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js"; // ← CAMBIO AQUÍ

const Role = sequelize.define("Role", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
}, { 
  tableName: "roles",
  timestamps: true 
});

export default Role;