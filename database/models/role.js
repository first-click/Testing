'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.belongsToMany(models.person, {
        through: models.role_person,

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
      posting_role: {
        type: DataTypes.STRING,
        defaultValue: 'reader',
        validate: {
          isIn: [['creator', 'editor', 'reader', 'applicant']],
        },
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
