'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    static associate(models) {
      Company.hasMany(models.person, {
        foreignKey: 'company_id',
      });
      Company.hasMany(models.position, {
        foreignKey: 'company_id',
      });
      Company.hasMany(models.posting, {
        foreignKey: 'company_id',
      });
    }
  }
  Company.init(
    {
      company_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      company_name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
    },
    {
      sequelize,
      ...sequelize.options,
      modelName: 'company',
      name: { singular: 'company', plural: 'companies' },
      tableName: 'companies',
    }
  );

  return Company;
};
