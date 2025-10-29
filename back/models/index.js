import { sequelize } from "../db/sequelize.js";
import { User } from "./user.js";
import { Store } from "./store.js";
import { Review } from "./review.js";
import { Menu } from "./menu.js";
import { Picture } from "./picture.js";

// 1. User → Store (1:N)
User.hasMany(Store, {
  foreignKey: "USER_ID",
  onDelete: "CASCADE",
  hooks: true,
});
Store.belongsTo(User, { foreignKey: "USER_ID" });

// 2. Store → Review (1:N)
Store.hasMany(Review, {
  foreignKey: "STORE_ID",
  onDelete: "CASCADE",
  hooks: true,
});
Review.belongsTo(Store, { foreignKey: "STORE_ID" });

// 3. User → Review (1:N)
User.hasMany(Review, {
  foreignKey: "USER_ID",
  onDelete: "CASCADE",
  hooks: true,
});
Review.belongsTo(User, { foreignKey: "USER_ID" });

// 4. Review → Picture (1:N)
Review.hasMany(Picture, { foreignKey: "REVIEW_ID", onDelete: "CASCADE" });
Picture.belongsTo(Review, { foreignKey: "REVIEW_ID" });

// 5. Store → Menu (1:N)
Store.hasMany(Menu, {
  foreignKey: "STORE_ID",
  onDelete: "CASCADE",
  hooks: true,
});
Menu.belongsTo(Store, { foreignKey: "STORE_ID" });

export { sequelize, User, Store, Review, Menu, Picture };
