const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('status', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    img_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    expired_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    time: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'status',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "status_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
