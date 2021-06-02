'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Person extends Model {
    static associate(models) {
      Person.belongsTo(models.user, {
        foreignKey: 'user_id',
      });
      Person.belongsToMany(models.applicant_filename, {
        through: models.person_applicant_filename,
        foreignKey: 'person_id',
      });

      Person.belongsTo(models.company, {
        foreignKey: 'company_id',
      });

      Person.belongsToMany(models.position, {
        through: models.person_position,
        foreignKey: 'person_id',
      });

      Person.belongsToMany(models.address, {
        through: models.address_person,
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
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        unique: true,
        type: DataTypes.INTEGER,
      },
      company_id: {
        references: {
          model: 'company',
          key: 'company_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        unique: true,
        type: DataTypes.INTEGER,
      },
      person_first_name: {
        type: DataTypes.STRING,
      },
      person_surname: {
        type: DataTypes.STRING,
      },
      person_fullName: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.person_first_name} ${this.person_surname}`;
        },
        set(value) {
          throw new Error('Do not try to set the `fullName` value!');
        },
      },
      person_email: {
        type: DataTypes.STRING,
        //unique: true,
        //allowNull: false,
        validate: { isEmail: true },
      },

      person_phonenumber: {
        type: DataTypes.STRING,
        //unique: true,
        //allowNull: false,
      },
      person_applicant_message_hiring_manager: {
        type: DataTypes.STRING,
      },
      person_linkedin: {
        type: DataTypes.STRING,
        //unique: true,
      },
      person_xing: {
        type: DataTypes.STRING,
        //unique: true,
      },
      person_applicant_data_protection: {
        type: DataTypes.BOOLEAN,
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
