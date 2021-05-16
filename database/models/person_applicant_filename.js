'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Person_applicant_filename extends Model {
    static associate(models) {
      Person_applicant_filename.belongsTo(models.applicant_filename, {
        foreignKey: 'applicant_filename_id',
      });
      Person_applicant_filename.belongsTo(models.person, {
        foreignKey: 'person_id',
      });
    }
  }
  Person_applicant_filename.init(
    {
      person_applicant_filename_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      person_id: {
        allowNull: false,
        references: {
          model: 'persons',
          key: 'person_id',
        },
        type: DataTypes.INTEGER,
      },
      applicant_filename_id: {
        allowNull: false,
        references: {
          model: 'applicant_filename',
          key: 'applicant_filename_id',
        },
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      ...sequelize.options,
      modelName: 'person_applicant_filename',
      name: {
        singular: 'person_applicant_filename',
        plural: 'person_applicant_filenames',
      },
      tableName: 'person_applicant_filenames',
    }
  );
  return Person_applicant_filename;
};
