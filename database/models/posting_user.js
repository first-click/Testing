'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Posting_user extends Model {
    static associate(models) {
      Posting_user.belongsTo(models.posting, {
        foreignKey: 'posting_id',
      });
      Posting_user.belongsTo(models.user, {
        foreignKey: 'user_id',
      });
    }
  }

  Posting_user.init(
    {
      posting_user_id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },

      posting_id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'posting',
          key: 'posting_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user_id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'user',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      ...sequelize.options,
      modelName: 'posting_user',
      name: { singular: 'posting_user', plural: 'postings_users' },
      tableName: 'postings_users',
    }
  );
  return Posting_user;
};
