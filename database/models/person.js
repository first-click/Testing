'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Person extends Model {
    static associate(models) {
      Person.belongsTo(models.user, {
        targetKey: 'user_id',
        foreignKey: 'user_id', // = person.user_id
        // default wäre person.user_user_id
      });
      Person.belongsToMany(models.position, {
        through: 'persons_positions',
        foreignKey: 'person_id',
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
      user_id: {
        allowNull: false,
        references: {
          model: 'user',
          key: 'user_id',
        },
        unique: true, // Muss unique sein. Dieser Eintrag führt
        // aber nicht zu einem validation error. Der kommt von
        // der DB
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
      tableName: 'persons', // anstatt people
    }
  );
  return Person;
};
