'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PostingUser extends Model {
    static associate(models) {
      PostingUser.belongsTo(models.posting, {
        targetKey: 'posting_id',
        foreignKey: 'posting_id',
      });
      PostingUser.belongsTo(models.user, {
        targetKey: 'user_id',
        foreignKey: 'user_id',
      });
    }
  }

  PostingUser.init(
    {
      posting_user_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      posting_id: {
        // primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'posting',
          key: 'posting_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user_id: {
        // primaryKey: true,
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
  return PostingUser;
};
