'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserPosition extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }

  UserPosition.init(
    {
      user_id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'user_id',
        },
      },
      position_id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'positions',
          key: 'position_id',
        },
      },
    },
    {
      sequelize,
      ...sequelize.options,
      modelName: 'user_position',
      tableName: 'users_positions', // anstatt people
    }
  );
  return UserPosition;
};
