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
        // der targetKey müsste hier nicht definiert werden
        targetKey: 'user_id', // default = user_id = PK in der user-Tabelle
        // der foreignKey muss definiert werden
        // "der foreignKey im Model computer heißt 'user_id'"
        foreignKey: 'user_id', // default = computer.user_user_id
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
