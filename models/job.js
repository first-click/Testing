'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Job.belongsTo(models.user);
    }
  }

  Job.init(
    {
      job_title: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'job',
    },
  );
  return Job;
};
