import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

const User = sequelize.define("TB_USER", {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  EMAIL: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  PASSWORD: {
    type: DataTypes.STRING(255),
  },
  NAME: {
    type: DataTypes.STRING(50),
  },
  ROLE: {
    type: DataTypes.STRING(10),
    defaultValue: "USER",
  },
}, {
  tableName: "TB_USER",
  timestamps: false,
});

export default User;
