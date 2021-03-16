'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Company_user extends Model {
    static associate(models) {
      Company_user.belongsTo(models.company, {
        foreignKey: 'company_id',
      });
      Company_user.belongsTo(models.user, {
        foreignKey: 'user_id',
      });
    }
  }

  Company_user.init(
    {
      company_user_id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },

      company_id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'company',
          key: 'company_id',
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
      modelName: 'company_user',
      name: { singular: 'company_user', plural: 'companies_users' },
      tableName: 'companies_users',
    }
  );
  return Company_user;
};
