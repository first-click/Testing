'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Applicant_filename extends Model {
    static associate(models) {
      Applicant_filename.belongsToMany(models.person, {
        through: models.person_applicant_filename,
        foreignKey: 'applicant_filename_id',
      });
    }
  }
  Applicant_filename.init(
    {
      applicant_filename_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      filename: {
        allowNull: true,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      ...sequelize.options,
      modelName: 'applicant_filename',
      name: { singular: 'applicant_filename', plural: 'applicant_filenames' },
      tableName: 'applicant_filenames',
    }
  );
  return Applicant_filename;
};
