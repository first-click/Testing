'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PersonPosition extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }

  PersonPosition.init(
    {
      person_id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'persons',
          key: 'person_id',
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
      modelName: 'person_position',
      tableName: 'persons_positions', // anstatt people
    }
  );
  return PersonPosition;
};
