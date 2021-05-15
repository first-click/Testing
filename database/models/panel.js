'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Panel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Panel.belongsTo(models.position, {
        foreignKey: { name: 'position_id' },
      });
      Panel.hasMany(models.panel_stakeholder, {
        foreignKey: { name: 'panel_id' },
      });
      Panel.hasMany(models.panel_scale, {
        foreignKey: { name: 'panel_id' },
      });
    }
  }
  Panel.init(
    {
      panel_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      company_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'company',
          key: 'company_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      position_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'positions',
          key: 'position_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        unique: true,
      },
      creator_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      status: {
        type: DataTypes.STRING,
        validate: {
          notNull: { msg: 'status must be defined' },
          isIn: {
            args: [['planning', 'ongoing', 'finished']],
            msg: 'status must be "planning", "ongoing", or "finished"',
          },
        },
        allowNull: false,
      },
    },
    {
      sequelize,
      ...sequelize.options,
      modelName: 'panel',
    }
  );
  return Panel;
};
