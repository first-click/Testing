'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posting extends Model {
    static associate(models) {
      Posting.belongsToMany(models.person, {
        through: models.posting_person,
        targetKey: 'posting_id',
        foreignKey: 'posting_id',
      });
      Posting.belongsTo(models.company, {
        foreignKey: 'company_id',
      });
      Posting.belongsTo(models.position, {
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

      position_id: {
        allowNull: false,
        references: {
          model: 'position',
          key: 'position_id',
        },
        type: DataTypes.INTEGER,
      },
      // address_id: {
      //   allowNull: false,
      //   references: {
      //     model: 'address',
      //     key: 'posting_id',
      //   },
      //   type: DataTypes.INTEGER,
      // },

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
        type: DataTypes.INTEGER,
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
