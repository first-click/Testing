'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Qualification extends Model {
    static associate(models) {
      Qualification.belongsToMany(models.posting, {
        through: models.posting_qualification,
        foreignKey: 'qualification_id',
      });
    }
  }
  Qualification.init(
    {
      qualification_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      qualification: {
        allowNull: true,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      ...sequelize.options,
      modelName: 'qualification',
      name: { singular: 'qualification', plural: 'qulifications' },
      tableName: 'qualifications',
    }
  );
  return Qualification;
};
