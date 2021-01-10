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
      Computer.belongsTo(models.user);
    }
  }
  Computer.init(
    {
      serial_number: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'computer',
    }
  );
  return Computer;
};
