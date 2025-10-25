import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/sequelize.js";

export class Review extends Model {}

Review.init(
  {
    ID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    USER_ID: { type: DataTypes.INTEGER, allowNull: false },
    STORE_ID: { type: DataTypes.INTEGER, allowNull: false },
    POINT_01: { type: DataTypes.TINYINT, allowNull: false },
    POINT_02: { type: DataTypes.TINYINT, allowNull: false },
    POINT_03: { type: DataTypes.TINYINT, allowNull: false },
    CONTENT: { type: DataTypes.TEXT, allowNull: true },
    CREATED_AT: { type: DataTypes.DATE, allowNull: true },
    UPDATED_AT: { type: DataTypes.DATE, allowNull: true },
    ORDERED_ITEM: { type: DataTypes.STRING(255), allowNull: false },
  },
  {
    sequelize,
    tableName: "TB_REVIEW",
    timestamps: false,
  }
);
