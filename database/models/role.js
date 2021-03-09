'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.belongsToMany(models.user, {
        through: models.role_user,

        foreignKey: 'role_id',
      });
    }
  }

  Role.init(
    {
      role_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      role_user: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      ...sequelize.options,
      modelName: 'role',
      name: { singular: 'role', plural: 'roles' },
      tableName: 'roles',
    }
  );
  return Role;
};
