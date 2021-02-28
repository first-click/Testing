'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posting extends Model {
    static associate(models) {
      Posting.hasMany(models.user, {
        foreignKey: 'user_id',
      });
      Posting.belongsTo(models.company, {
        targetKey: 'company_id',
        foreignKey: 'company_id',
      });
      Posting.belongsTo(models.position, {
        targetKey: 'postion_id',
        foreignKey: 'position_id',
      });
    }
  }
  Posting.init(
    {
      posting_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      company_id: {
        allowNull: false,
        references: {
          model: 'company',
          key: 'company_id',
        },
        type: DataTypes.INTEGER,
      },
      posting_role: {
        allowNull: false,
        type: DataTypes.ENUM(['creator', 'editor', 'reader', 'applicant']),
      },
      posting_date: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      posting_description: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      posting_benefits: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      posting_qualifications: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      posting_working_hours: {
        allowNull: false,
        type: DataTypes.NUMBER,
      },
      posting_contact_person: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      posting_contact_email: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      posting_contact_phonenumber: {
        allowNull: false,
        type: DataTypes.NUMBER,
      },
      posting_salary: {
        allowNull: false,
        type: DataTypes.NUMBER,
      },
    },
    {
      sequelize,
      ...sequelize.options,
      modelName: 'posting',
    }
  );
  return Posting;
};
