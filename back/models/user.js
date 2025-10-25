// /back/models/user.js
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/sequelize.js";

class User extends Model {}

User.init(
  {
    ID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    EMAIL: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    PASSWORD: { type: DataTypes.STRING(255), allowNull: true },
    KAKAO_ID: { type: DataTypes.STRING(50), allowNull: true, unique: true },
    NAME: { type: DataTypes.STRING(50), allowNull: false },
    ROLE: { type: DataTypes.STRING(10), allowNull: false, defaultValue: "USER" },
    CREATED_AT: { type: DataTypes.DATE, allowNull: true },
    UPDATED_AT: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: "TB_USER",
    timestamps: false,
  }
);

export { User };
