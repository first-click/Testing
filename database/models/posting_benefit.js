'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posting_benefit extends Model {
    static associate(models) {
      Posting_benefit.belongsTo(models.posting, {
        foreignKey: 'posting_benefit',
      });
    }
  }
  Posting.init(
    {
      posting_benefit_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      posting_id: {
        allowNull: false,
        references: {
          model: 'postings',
          key: 'posting_id',
        },
        type: DataTypes.INTEGER,
      },
      posting_benefit: {
        allowNull: true,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      ...sequelize.options,
      modelName: 'posting_benefit',
      name: { singular: 'posting_benefit', plural: 'posting_benefits' },
      tableName: 'posting_benefits',
    }
  );
  return Posting_benefit;
};
