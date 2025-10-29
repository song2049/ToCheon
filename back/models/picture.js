import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/sequelize.js";

export class Picture extends Model {}

Picture.init(
  {
    ID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    REVIEW_ID: { type: DataTypes.INTEGER, allowNull: false },
    URL: { type: DataTypes.STRING(255), allowNull: false },
    IS_MAIN: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
    CREATED_AT: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: "TB_PICTURE",
    timestamps: false,
  }
);
