// /back/models/index.js
import { sequelize } from "../db/sequelize.js";
import { User } from "./user.js";
import { Store } from "./store.js";
import { Review } from "./review.js";
import { Menu } from "./menu.js";
import { Picture } from "./picture.js";

// ================================
// 관계 정의 (CASCADE 삭제 포함)
// ================================

// 사용자(User) - 리뷰(Review): 1:N
User.hasMany(Review, {
  foreignKey: "USER_ID",
  onDelete: "CASCADE", // 유저 삭제 시 리뷰 자동 삭제
  onUpdate: "CASCADE",
});
Review.belongsTo(User, {
  foreignKey: "USER_ID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// 매장(Store) - 리뷰(Review): 1:N
Store.hasMany(Review, {
  foreignKey: "STORE_ID",
  onDelete: "CASCADE", // 매장 삭제 시 리뷰 자동 삭제
  onUpdate: "CASCADE",
});
Review.belongsTo(Store, {
  foreignKey: "STORE_ID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// 매장(Store) - 메뉴(Menu): 1:N
Store.hasMany(Menu, {
  foreignKey: "STORE_ID",
  onDelete: "CASCADE", // 매장 삭제 시 메뉴 자동 삭제
  onUpdate: "CASCADE",
});
Menu.belongsTo(Store, {
  foreignKey: "STORE_ID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// 매장(Store) - 사진(Picture): 1:N
Store.hasMany(Picture, {
  foreignKey: "STORE_ID",
  onDelete: "CASCADE", // 매장 삭제 시 사진 자동 삭제
  onUpdate: "CASCADE",
});
Picture.belongsTo(Store, {
  foreignKey: "STORE_ID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// ================================
// DB 동기화 (CASCADE 적용 반영)
// ================================
export async function syncModels() {
  try {
    await sequelize.sync({ alter: true }); // 스키마 자동 조정
    console.log("Sequelize models synchronized (with CASCADE)");
  } catch (err) {
    console.error("Sequelize sync error:", err);
  }
}

// ================================
// export
// ================================
export { sequelize, User, Store, Review, Menu, Picture };
