import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const UserRole = sequelize.define("UserRole", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
}, { tableName: "user_roles" });

export default UserRole;
