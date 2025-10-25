import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/sequelize.js";

export class Store extends Model {}

Store.init(
  {
    ID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    USER_ID: { type: DataTypes.INTEGER, allowNull: false },
    CATEGORY: { type: DataTypes.STRING(100), allowNull: false },
    NAME: { type: DataTypes.STRING(100), allowNull: false },
    ADDRESS: { type: DataTypes.STRING(255), allowNull: false },
    LATITUDE: { type: DataTypes.DECIMAL(10, 8), allowNull: false },
    LONGITUDE: { type: DataTypes.DECIMAL(11, 8), allowNull: false },
    TEL_NUMBER: { type: DataTypes.STRING(20), allowNull: true },
    DESCRIPTION: { type: DataTypes.TEXT, allowNull: true },
    IS_APPROVED: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: 0 },
    CREATED_AT: { type: DataTypes.DATE, allowNull: true },
    UPDATED_AT: { type: DataTypes.DATE, allowNull: true },
    HASH_TAG: { type: DataTypes.STRING(255), allowNull: false },
    EATING_TIME: { type: DataTypes.STRING(20), allowNull: false },
  },
  {
    sequelize,
    tableName: "TB_STORE",
    timestamps: false,
  }
);
