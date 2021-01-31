'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PersonPosition extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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
      person_id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'person',
          key: 'person_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      position_id: {
        primaryKey: true,
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
      // name: { singular: 'person_position', plural: 'persons_positions' },
      tableName: 'persons_positions', // anstatt people
    }
  );
  return PersonPosition;
};
