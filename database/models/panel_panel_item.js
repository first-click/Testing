'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Panel_PanelItem extends Model {
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
  Panel_PanelItem.init(
    {
      panel_panel_item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      panel_item_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'panel_items',
          key: 'panel_item_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        // allowNull: false,
        // validate: { notNull: { msg: 'panel_item_id must be defined' } },
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

      // Werte werden kopiert. Damit kann das PanelItem für zukünftige Panels
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
      modelName: 'panel_panel_item',
    }
  );
  return Panel_PanelItem;
};
