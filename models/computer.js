'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Computer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Computer.belongsTo(models.user, {
        targetKey: 'user_id',
        foreignKey: 'computer_id',
      });
    }
  }
  Computer.init(
    {
      computer_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      serial_number: DataTypes.STRING,
    },
    {
      // ...sequelize.options,
      sequelize,
      modelName: 'computer',
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Computer;
};
