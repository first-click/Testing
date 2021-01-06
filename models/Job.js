'use strict';
const { Model } = require('sequelize');

const Job = (sequelize, DataTypes) => {
  class Job extends Model {
    // static associate(models) {
    //   // Job belongsTo Company
    //   Job.belongsTo(models.Company);
    // }
  }

  Job.init(
    {
      tasks: { type: DataTypes.STRING, allowNull: false },
      qualifications: { type: DataTypes.STRING, allowNull: false },
      jobspecification: { type: DataTypes.STRING, allowNull: true },
    },

    {
      sequelize,
      modelName: 'job',
    }
  );
  return Job;
};

module.exports = Job;
