'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posting_qualification extends Model {
    static associate(models) {
      Posting_qualification.belongsTo(models.posting, {
        foreignKey: 'posting_id',
      });
      Posting_qualification.belongsTo(models.qualification, {
        foreignKey: 'qualification_id',
      });
    }
  }
  Posting_qualification.init(
    {
      posting_qualification_id: {
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
      qualification_id: {
        allowNull: false,
        references: {
          model: 'qualifications',
          key: 'qualification_id',
        },
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      ...sequelize.options,
      modelName: 'posting_qualification',
      name: {
        singular: 'posting_qualification',
        plural: 'posting_qualifications',
      },
      tableName: 'posting_qualifications',
    }
  );
  return Posting_qualification;
};
