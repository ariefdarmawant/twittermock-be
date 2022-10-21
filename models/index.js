const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: false,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.tweet = require("../models/tweet.model.js")(sequelize, Sequelize);
db.refreshJwt = require("../models/refreshJwt.model.js")(sequelize, Sequelize);

db.user.hasMany(db.tweet, { as: "tweets", onDelete: "CASCADE" });
db.tweet.belongsTo(db.user, {
  foreignKey: { allowNull: false, name: "userId" },
  as: "author",
});

db.refreshJwt.belongsTo(db.user, {
  foreignKey: "userId",
  targetKey: "id",
});
db.user.hasOne(db.refreshJwt, {
  foreignKey: "userId",
  targetKey: "id",
});

db.tweet.belongsTo(db.tweet, { as: "parent", onDelete: 'CASCADE' });
db.tweet.hasMany(db.tweet, { as: "children", foreignKey: 'parentId', useJunctionTable: false});

module.exports = db;
