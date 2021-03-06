'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posting extends Model {
    static associate(models) {
      Posting.belongsToMany(models.user, {
        through: models.posting_user,
        foreignKey: 'posting_id',
      });

      Posting.belongsTo(models.company, {
        foreignKey: 'company_id',
      });
      Posting.belongsTo(models.position, {
        foreignKey: 'position_id',
      });

      Posting.belongsToMany(models.benefit, {
        through: models.posting_benefit,
        foreignKey: 'posting_id',
      });
      Posting.belongsToMany(models.qualification, {
        through: models.posting_qualification,
        foreignKey: 'posting_id',
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

      position_id: {
        allowNull: false,
        references: {
          model: 'position',
          key: 'position_id',
        },
        type: DataTypes.INTEGER,
      },

      posting_startdate: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      posting_enddate: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      posting_description: {
        allowNull: false,
        type: DataTypes.STRING,
      },

      posting_working_hours: {
        allowNull: false,
        type: DataTypes.INTEGER,
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
        type: DataTypes.STRING,
      },
      posting_salary: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      ...sequelize.options,
      modelName: 'posting',
      name: { singular: 'posting', plural: 'postings' },
      tableName: 'postings',
    }
  );
  return Posting;
};
