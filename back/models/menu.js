import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/sequelize.js";

export class Menu extends Model {}

Menu.init(
  {
    ID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    STORE_ID: { type: DataTypes.INTEGER, allowNull: false },
    NAME: { type: DataTypes.STRING(100), allowNull: false },
    PRICE: { type: DataTypes.INTEGER, allowNull: false },
    DESCRIPTION: { type: DataTypes.TEXT, allowNull: true },
    CREATED_AT: { type: DataTypes.DATE, allowNull: true },
    UPDATED_AT: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: "TB_MENU",
    timestamps: false,
  }
);
