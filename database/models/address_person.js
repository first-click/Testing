'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Address_person extends Model {
    static associate(models) {
      Address_person.belongsTo(models.person, {
        foreignKey: 'person_id',
      });
      Address_person.belongsTo(models.address, {
        foreignKey: 'address_id',
      });
    }
  }

  Address_person.init(
    {
      address_person_id: {
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
      person_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'persons',
          key: 'person_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      ...sequelize.options,
      modelName: 'address_person',
      name: { singular: 'address_person', plural: 'addresses_persons' },
      tableName: 'addresses_persons',
    }
  );
  return Address_person;
};
