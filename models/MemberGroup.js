const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MemberGroup', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    Group_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    User_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'MemberGroup',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "MemberGroup_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
