'use strict';
const { Model } = require('sequelize');

const Posting = (sequelize, DataTypes) => {
  class Posting extends Model {
    // static associate(models) {
    //   // Posting belongsTo Job, Company
    //   Posting.belongsTo(models.Job);
    //   Posting.belongsTo(models.Company);
    // }
  }

  Posting.init(
    {
      publication: { type: DataTypes.DATE, allowNull: false },
      contactemail: { type: DataTypes.STRING, allowNull: false },
      contactpersons: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: 'posting',
    }
  );
  return Posting;
};

module.exports = Posting;
