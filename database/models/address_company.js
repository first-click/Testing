'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Address_company extends Model {
    static associate(models) {
      Address_company.belongsTo(models.company, {
        foreignKey: 'company_id',
      });
      Address_company.belongsTo(models.address, {
        foreignKey: 'address_id',
      });
    }
  }

  Address_company.init(
    {
      address_company_id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      address_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'addresses',
          key: 'address_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      company_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'companies',
          key: 'company_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      ...sequelize.options,
      modelName: 'address_company',
      name: { singular: 'address_company', plural: 'addresses_companies' },
      tableName: 'addresses_companies',
    }
  );
  return Address_company;
};
