'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PersonPosition extends Model {
    static associate(models) {
      UserPosition.belongsTo(models.user, {
        targetKey: 'user_id',
        foreignKey: 'user_id',
      });
      UserPosition.belongsTo(models.position, {
        targetKey: 'position_id',
        foreignKey: 'position_id',
      });
    }
  }

  PersonPosition.init(
    {
      user_position_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'user',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      position_id: {
        // primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'position',
          key: 'position_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      ...sequelize.options,
      modelName: 'user_position',
      name: { singular: 'user_position', plural: 'users_positions' },
      tableName: 'users_positions',
    }
  );
  return UserPosition;
};
