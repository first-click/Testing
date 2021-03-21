'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role_user extends Model {
    static associate(models) {
      Role_user.belongsTo(models.role, {
        foreignKey: 'role_id',
      });
      Role_user.belongsTo(models.user, {
        foreignKey: 'user_id',
      });
    }
  }

  Role_user.init(
    {
      role_user_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      role_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'roles',
          key: 'role_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      role_user: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      ...sequelize.options,
      modelName: 'role_user',
      name: { singular: 'role_user', plural: 'roles_users' },
      tableName: 'roles_users',
    }
  );
  return Role_user;
};
