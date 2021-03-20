'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    static associate(models) {
      Address.belongsToMany(models.person, {
        through: models.address_person,
        foreignKey: 'address_id',
      });

      Address.belongsToMany(models.company, {
        through: models.address_company,
        foreignKey: 'address_id',
      });
    }
  }
  Address.init(
    {
      address_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      address_street: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      address_street_number: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: true,
      },
      address_postal_code: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: true,
      },
      address_city: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },

      address_country: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
    },
    {
      sequelize,
      ...sequelize.options,
      modelName: 'address',
      name: { singular: 'address', plural: 'addresses' },
      tableName: 'addresses',
    }
  );

  return Address;
};
