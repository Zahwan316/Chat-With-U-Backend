var DataTypes = require("sequelize").DataTypes;
var _Message = require("./Message");
var _User = require("./User");

function initModels(sequelize) {
  var Message = _Message(sequelize, DataTypes);
  var User = _User(sequelize, DataTypes);


  return {
    Message,
    User,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
