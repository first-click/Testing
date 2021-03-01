'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Person extends Model {
    static associate(models) {
      Person.hasMany(models.person, {
        onDelete: 'CASCADE',
        foreignKey: 'manager_id',
        as: 'children',
      });
      Person.belongsTo(models.user, {
        foreignKey: 'user_id',
      });

      Person.belongsTo(models.company, {
        foreignKey: 'company_id',
      });

      Person.belongsToMany(models.position, {
        through: models.person_position,
        targetKey: 'person_id',
        foreignKey: 'person_id',
      });
      Person.belongsToMany(models.posting, {
        through: models.posting_person,
        targetKey: 'person_id',
        foreignKey: 'person_id',
      });
      Person.belongsToMany(models.address, {
        through: models.person_address,
        targetKey: 'person_id',
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
      manager_id: {
        references: {
          model: 'person',
          key: 'person_id',
        },
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
      person_gender: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      person_birthday: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      person_phone_number: {
        allowNull: true,
        type: DataTypes.NUMBER,
      },
      person_picture: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      person_education: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      person_start_date_education: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      person_end_date_education: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      person_professional_activity: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      person_start_date_professional_activity: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      person_end_date_professional_activity: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      person_competences: {
        allowNull: false,
        type: DataTypes.ARRAY,
      },
      person_further_trainings: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      person_start_date_further_trainings: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      person_end_date_further_trainings: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      person_professional_targets: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      person_company_level: {
        allowNull: false,
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
