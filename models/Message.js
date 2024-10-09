const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Message', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    group_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    user_target_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    soft_delete: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    created_Date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    time: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_from_id: {
      type: DataTypes.UUID,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Message',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Message_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
