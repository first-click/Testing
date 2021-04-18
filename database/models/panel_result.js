'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PanelResult extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Panel_Stakeholder.hasOne(models.user, {
      //   foreignKey: { name: 'creator_id' },
      // });
    }
  }
  PanelResult.init(
    {
      panel_result_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      panel_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'panels',
          key: 'panel_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
        validate: { notNull: { msg: 'panel_id must be defined' } },
      },
      interviewer_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        // allowNull: false,
        // validate: { notNull: { msg: 'interviewer_id must be defined' } },
      },
      applicant_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        // allowNull: false,
        // validate: { notNull: { msg: 'applicant_id must be defined' } },
      },
      panel_scale_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'panel_scales',
          key: 'panel_panel_item_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        // allowNull: false,
        // validate: { notNull: { msg: 'panel_panel_item_id must be defined' } },
      },
      scale: {
        type: DataTypes.STRING,
        // allowNull: false,
        // validate: { notNull: { msg: 'scale must be defined' } },
      },
      type: {
        type: DataTypes.STRING,
        // allowNull: false,
        // validate: { notNull: { msg: 'type must be defined' } },
      },
      value_number: {
        type: DataTypes.STRING,
      },
      value_string: {
        type: DataTypes.STRING,
      },
      comment: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      ...sequelize.options,
      modelName: 'panel_result',
      validate: {
        onlyOneType() {
          if (this.type === 'number' && this.value_number === null) {
            throw new Error('value_number must be defined');
          }
          if (this.type === 'string' && this.value_string === null) {
            throw new Error('value_string must be defined');
          }
          if (this.value_number === null && this.value_string === null) {
            throw new Error('you must enter a rating');
          }
          if (this.value_number !== null && this.value_string !== null) {
            throw new Error('rating must be either string or number, not both');
          }
        },
      },
    }
  );
  return PanelResult;
};
