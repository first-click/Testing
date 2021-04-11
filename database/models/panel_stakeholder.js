'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Panel_Stakeholder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Panel_Stakeholder.belongsTo(models.panel, {
        foreignKey: { name: 'panel_id' },
      });
      Panel_Stakeholder.belongsTo(models.user, {
        foreignKey: { name: 'user_id' },
      });
    }
  }
  Panel_Stakeholder.init(
    {
      // panel_stakeholder_id: {
      //   primaryKey: true,
      //   autoIncrement: true,
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      // },
      panel_id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'panels',
          key: 'panel_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        validate: { notNull: { msg: 'panel_id must be defined' } },
        allowNull: false,
      },
      user_id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        validate: { notNull: { msg: 'user_id must be defined' } },
        allowNull: false,
      },
      panel_role: {
        type: DataTypes.STRING,
        validate: {
          notNull: { msg: 'panel_role must be defined' },
          isIn: {
            args: [['master', 'interviewer', 'council', 'applicant']],
            msg:
              'panel_role must be "master", "interviewer", "council", or "applicant"',
          },
        },
        allowNull: false,
      },
    },
    {
      sequelize,
      ...sequelize.options,
      modelName: 'panel_stakeholder',
    }
  );
  return Panel_Stakeholder;
};
