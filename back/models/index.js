import { sequelize } from "../db/sequelize.js";
import { User } from "./user.js";
import { Store } from "./store.js";
import { Review } from "./review.js";
import { Menu } from "./menu.js";
import { Picture } from "./picture.js";

User.hasMany(Review, { foreignKey: "USER_ID" });
Review.belongsTo(User, { foreignKey: "USER_ID" });

Store.hasMany(Review, { foreignKey: "STORE_ID" });
Review.belongsTo(Store, { foreignKey: "STORE_ID" });

Store.hasMany(Menu, { foreignKey: "STORE_ID" });
Store.hasMany(Picture, { foreignKey: "STORE_ID" });

export { sequelize, User, Store, Review, Menu, Picture };
