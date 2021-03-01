'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PersonAddress extends Model {
    static associate(models) {
      PersonAddress.belongsTo(models.person, {
        targetKey: 'person_id',
        foreignKey: 'person_id',
      });
      PersonAddress.belongsTo(models.address, {
        targetKey: 'address_id',
        foreignKey: 'address_id',
      });
    }
  }

  PersonAddress.init(
    {
      person_address_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      person_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'person',
          key: 'person_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      address_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'address',
          key: 'address_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      ...sequelize.options,
      modelName: 'person_address',
      name: { singular: 'person_address', plural: 'persons_addresses' },
      tableName: 'persons_addresses',
    }
  );
  return PersonPosition;
};
