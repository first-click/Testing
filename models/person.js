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
      Person.belongsTo(models.user, {
        targetKey: 'user_id',
        foreignKey: 'user_id', // = person.user_id
        // default wäre person.user_user_id
      });
    }
  }

  Person.init(
    {
      person_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      person_first_name: {
        type: DataTypes.STRING,
      },
      person_last_name: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      ...sequelize.options,
      modelName: 'person',
    }
  );
  return Person;
};
