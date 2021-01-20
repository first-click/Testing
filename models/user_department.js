'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserDepartment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }

  UserDepartment.init(
    {
      user_id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'user_id',
        },
      },
      department_id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'departments',
          key: 'department_id',
        },
      },
    },
    {
      sequelize,
      ...sequelize.options,
      modelName: 'user_department',
      tableName: 'users_departments', // anstatt people
    }
  );
  return UserDepartment;
};
