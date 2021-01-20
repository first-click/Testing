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
        foreignKey: 'department_id',
        // as: 'users',
        // foreignKey: 'department_id',
      });
    }
  }
  Department.init(
    {
      department_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      address: DataTypes.STRING,
    },
    {
      sequelize,
      ...sequelize.options,
      modelName: 'department',
    }
  );
  return Department;
};
