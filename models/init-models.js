var DataTypes = require("sequelize").DataTypes;
var _Group = require("./Group");
var _MemberGroup = require("./MemberGroup");
var _Message = require("./Message");
var _Uploads = require("./Uploads");
var _User = require("./User");
var _status = require("./status");

function initModels(sequelize) {
  var Group = _Group(sequelize, DataTypes);
  var MemberGroup = _MemberGroup(sequelize, DataTypes);
  var Message = _Message(sequelize, DataTypes);
  var Uploads = _Uploads(sequelize, DataTypes);
  var User = _User(sequelize, DataTypes);
  var status = _status(sequelize, DataTypes);

  status.belongsTo(User, { as: "user", foreignKey: "user_id"});
  User.hasMany(status, { as: "statuses", foreignKey: "user_id"});

  return {
    Group,
    MemberGroup,
    Message,
    Uploads,
    User,
    status,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
