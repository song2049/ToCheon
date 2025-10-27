import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/sequelize.js";

export class Review extends Model {}

Review.init(
  {
    ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    USER_ID: DataTypes.INTEGER,
    STORE_ID: DataTypes.INTEGER,
    POINT_01: DataTypes.TINYINT,
    POINT_02: DataTypes.TINYINT,
    POINT_03: DataTypes.TINYINT,
    CONTENT: DataTypes.TEXT,
    ORDERED_ITEM: DataTypes.STRING(255),
    CREATED_AT: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "TB_REVIEW",
    timestamps: false,
  }
);
