'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Panel_Scale extends Model {
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
  Panel_Scale.init(
    {
      panel_scale_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      scale_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'scales',
          key: 'scale_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        // allowNull: false,
        // validate: { notNull: { msg: 'scale_id must be defined' } },
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
      // company_id: {
      //   type: DataTypes.INTEGER,
      //   references: {
      //     model: 'company',
      //     key: 'company_id',
      //   },
      // },

      // Werte werden kopiert. Damit kann das Scale für zukünftige Panels
      // verändert oder gelöscht werden
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notNull: { msg: 'name must be defined' } },
      },
      description: {
        type: DataTypes.STRING,
      },
      scale: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notNull: { msg: 'scale must be defined' } },
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notNull: { msg: 'type must be defined' } },
      },
    },
    {
      sequelize,
      ...sequelize.options,
      modelName: 'panel_scale',
    }
  );
  return Panel_Scale;
};
