'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PersonPosition extends Model {
    static associate(models) {
      PersonPosition.belongsTo(models.person, {
        targetKey: 'person_id',
        foreignKey: 'person_id',
      });
      PersonPosition.belongsTo(models.position, {
        targetKey: 'position_id',
        foreignKey: 'position_id',
      });
    }
  }

  PersonPosition.init(
    {
      person_position_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      person_id: {
        // primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'person',
          key: 'person_id',
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
      modelName: 'person_position',
      name: { singular: 'person_position', plural: 'persons_positions' },
      tableName: 'persons_positions',
    }
  );
  return PersonPosition;
};
