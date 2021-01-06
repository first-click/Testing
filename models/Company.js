'use strict';
const { Model } = require('sequelize');

const Company = (sequelize, DataTypes) => {
  class Company extends Model {
    // static associate(models) {
    //   // Company hasMany Jobs
    //   Company.hasMany(models.Job);
    // }
  }

  Company.init(
    {
      companylogo: { type: DataTypes.STRING, allowNull: false },
      companyname: { type: DataTypes.STRING, allowNull: false },
      companyId: { type: DataTypes.STRING, allowNull: false },
      subgroupname: { type: DataTypes.STRING, allowNull: true },
      subgroupId: { type: DataTypes.STRING, allowNull: true },
      companydescription: { type: DataTypes.STRING, allowNull: false },
      workingcountry: { type: DataTypes.STRING, allowNull: false },
      workingcity: { type: DataTypes.STRING, allowNull: false },
      workingaddress: { type: DataTypes.STRING, allowNull: false },
      awards: { type: DataTypes.STRING, allowNull: true },
      department: { type: DataTypes.STRING, allowNull: true },
      joblevel: { type: DataTypes.STRING, allowNull: false },
      jobId: { type: DataTypes.STRING, allowNull: false },
      jobtitle: { type: DataTypes.STRING, allowNull: false },
      benefits: { type: DataTypes.STRING, allowNull: false },
      offeremployer: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: 'company',
    }
  );
  return Company;
};

module.exports = Company;
