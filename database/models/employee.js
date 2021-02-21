'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate(models) {
      Employee.hasMany(models.employee, {
        onDelete: 'CASCADE',
        foreignKey: 'manager_id',
        as: 'children',
      });
    }
  }

  Employee.init(
    {
      employee_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      manager_id: {
        references: {
          model: 'employee',
          key: 'employee_id',
        },
        type: DataTypes.INTEGER,
      },

      employee_name: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      ...sequelize.options,
      modelName: 'employee',
    }
  );
  return Employee;
};
