'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Person_position extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Person_position.belongsTo(models.person, {
        foreignKey: 'person_id',
      });
      Person_position.belongsTo(models.position, {
        foreignKey: 'position_id',
      });
    }
  }

  Person_position.init(
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
  return Person_position;
};
