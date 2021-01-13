'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Person extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Person.belongsTo(models.user);
    }
  }

  Person.init(
    {
      person_first_name: {
        type: DataTypes.STRING,
      },
      person_last_name: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'person',
    }
  );
  return Person;
};
