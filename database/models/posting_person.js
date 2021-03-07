'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Posting_person extends Model {
    static associate(models) {
      Posting_person.belongsTo(models.posting, {
        foreignKey: 'posting_id',
      });
      Posting_person.belongsTo(models.person, {
        foreignKey: 'person_id',
      });
    }
  }

  Posting_person.init(
    {
      posting_person_id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },

      posting_id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'posting',
          key: 'posting_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      person_id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'person',
          key: 'person_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      ...sequelize.options,
      modelName: 'posting_person',
      name: { singular: 'posting_person', plural: 'postings_persons' },
      tableName: 'postings_persons',
    }
  );
  return Posting_person;
};
