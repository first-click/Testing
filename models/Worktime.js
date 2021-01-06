'use strict';
const { Model } = require('sequelize');

const Worktime = (sequelize, DataTypes) => {
  class Worktime extends Model {
    // static associate(models) {
    //   // Worktime belongsTo Jobs
    //   Worktime.belongsTo(models.Job);
    // }
  }

  Worktime.init(
    {
      fulltime: { type: DataTypes.BOOLEAN, allowNull: true },
      parttime: { type: DataTypes.BOOLEAN, allowNull: true },
      hours: { type: DataTypes.NUMBER, allowNull: true },
    },
    {
      sequelize,
      modelName: 'worktime',
    }
  );
  return Worktime;
};

module.exports = Worktime;
