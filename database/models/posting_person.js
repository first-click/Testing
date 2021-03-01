'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PostingPerson extends Model {
    static associate(models) {
      PostingPerson.belongsTo(models.posting, {
        targetKey: 'posting_id',
        foreignKey: 'posting_id',
      });
      PostingPerson.belongsTo(models.person, {
        targetKey: 'person_id',
        foreignKey: 'person_id',
      });
    }
  }

  PostingPerson.init(
    {
      posting_person_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      posting_id: {
        // primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'posting',
          key: 'posting_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      person_id: {
        // primaryKey: true,
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
  return PostingPerson;
};
