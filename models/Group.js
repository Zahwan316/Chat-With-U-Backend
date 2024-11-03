const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Group', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    admin_user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    visibility: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Group',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Group_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
