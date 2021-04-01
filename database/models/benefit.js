'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Benefit extends Model {
    static associate(models) {
      Benefit.belongsToMany(models.posting, {
        through: models.posting_benefit,
        foreignKey: 'benefit_id',
      });
    }
  }
  Benefit.init(
    {
      benefit_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      benefit: {
        allowNull: true,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      ...sequelize.options,
      modelName: 'benefit',
      name: { singular: 'benefit', plural: 'benefits' },
      tableName: 'benefits',
    }
  );
  return Benefit;
};
