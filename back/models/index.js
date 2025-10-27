import { sequelize } from "../db/sequelize.js";
import { User } from "./user.js";
import { Store } from "./store.js";
import { Review } from "./review.js";
import { Menu } from "./menu.js";
import { Picture } from "./picture.js";

User.hasMany(Review, { foreignKey: "USER_ID" });

Review.belongsTo(User, { foreignKey: "USER_ID" });
Review.belongsTo(Store, { foreignKey: "STORE_ID" });
Review.hasMany(Picture, { foreignKey: "REVIEW_ID", as: "pictures" });

Store.hasMany(Review, { foreignKey: "STORE_ID" });
Store.hasMany(Menu, { foreignKey: "STORE_ID" });
Store.hasMany(Picture, { foreignKey: "STORE_ID" });

Picture.belongsTo(Review, { foreignKey: "REVIEW_ID", as: "review" });

export { sequelize, User, Store, Review, Menu, Picture };
