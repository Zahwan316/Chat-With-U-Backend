var DataTypes = require("sequelize").DataTypes;
var _Message = require("./Message");
var _User = require("./User");
var _status = require("./status");

function initModels(sequelize) {
  var Message = _Message(sequelize, DataTypes);
  var User = _User(sequelize, DataTypes);
  var status = _status(sequelize, DataTypes);

  status.belongsTo(User, { as: "user", foreignKey: "user_id"});
  User.hasMany(status, { as: "statuses", foreignKey: "user_id"});

  return {
    Message,
    User,
    status,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
