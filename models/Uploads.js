const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Uploads', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    soft_delete: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Uploads',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Uploads_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
