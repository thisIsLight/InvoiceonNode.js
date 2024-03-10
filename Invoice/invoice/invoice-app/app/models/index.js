const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
  operatorsAliases: false,
  query:{raw:true},

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.products = require("./product.model.js")(sequelize, Sequelize);
db.fulfillers = require("./fulfiller.model.js")(sequelize, Sequelize);
db.discounttypes = require("./discounttype.model.js")(sequelize, Sequelize);
db.ratetypes = require("./ratetype.model.js")(sequelize, Sequelize);
db.shippingrates = require("./shippingrates.model.js")(sequelize, Sequelize);
db.productfulfillermappings = require("./productfulfillermapping.model.js")(sequelize, Sequelize);
db.discounts = require("./discount.model.js")(sequelize, Sequelize);
db.discountrequirements = require("./discountrequirement.model.js")(sequelize, Sequelize);
db.productdiscountmappings = require("./productdiscountmapping.model.js")(sequelize, Sequelize);

db.shippingrates.belongsTo(db.fulfillers, {
  foreignKey: "FulFillerId"
});
db.shippingrates.belongsTo(db.ratetypes, {
  foreignKey: "RateTypeId"
});

db.productfulfillermappings.belongsTo(db.fulfillers, {
  foreignKey: "FulFillerId"
});
db.productfulfillermappings.belongsTo(db.products, {
  foreignKey: "ProductId"
});

db.discounts.belongsTo(db.discounttypes, {
  foreignKey: "DiscountTypeId"
});
db.discounts.belongsTo(db.ratetypes, {
  foreignKey: "RateTypeId"
});

db.discountrequirements.belongsTo(db.discounts, {
  foreignKey: "DiscountId"
});

db.productdiscountmappings.belongsTo(db.products, {
  foreignKey: 'ProductId'
})
db.productdiscountmappings.belongsTo(db.discounts, {
  foreignKey: 'DiscountId'
})

module.exports = db;