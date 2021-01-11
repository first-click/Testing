'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Department.belongsToMany(models.user, {
        through: 'users_departments',
        // as: 'users',
        // foreignKey: 'department_id',
      });
    }
  }
  Department.init(
    {
      address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'department',
    }
  );
  return Department;
};
