'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Person extends Model {
    static associate(models) {
      Person.belongsTo(models.user, {
        foreignKey: 'user_id',
      });

      Person.belongsTo(models.company, {
        foreignKey: 'company_id',
      });

      Person.belongsToMany(models.position, {
        through: models.person_position,

        foreignKey: 'person_id',
      });
      Person.belongsToMany(models.posting, {
        through: models.posting_person,

        foreignKey: 'person_id',
      });
      Person.belongsToMany(models.role, {
        through: models.role_person,

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
        references: {
          model: 'user',
          key: 'user_id',
        },
        unique: true,
        type: DataTypes.INTEGER,
      },
      company_id: {
        references: {
          model: 'company',
          key: 'company_id',
        },
        unique: true,
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
      name: { singular: 'person', plural: 'persons' },
      tableName: 'persons',
    }
  );
  return Person;
};
