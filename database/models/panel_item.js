'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PanelItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Panel.hasOne(models.user, {
      //   foreignKey: { name: 'creator_id' },
      // });
    }
  }
  PanelItem.init(
    {
      panel_item_id: {
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
      creator_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      editor_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notNull: { msg: 'title must be defined' } },
        unique: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notNull: { msg: 'description must be defined' } },
      },
      length: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'length must be defined' },
          min: { args: 2, msg: 'length must be between 2 and 10' },
          max: { args: 10, msg: 'length must be between 2 and 10' },
        },
      },
      fields: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
        validate: {
          notNull: { msg: 'fields must be defined' },
          checkLength(arr) {
            if (arr.length !== this.dataValues.length)
              throw new Error('Field count must be equal to desired length');
          },
        },
      },
      anchors: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        validate: {
          checkLength(arr) {
            if (arr.length !== this.dataValues.length)
              throw new Error('Anchor count must be equal to desired length');
          },
        },
      },
      // scale: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      //   validate: {
      //     notNull: { msg: 'scale must be defined' },
      //     isIn: {
      //       args: [['text', '2', '3', '4', '5', '6', '7']],
      //       msg: 'scale must be "text", "2", "3", "4", "5", "6", "7"',
      //     },
      //   },
      // },
      // type: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      //   validate: {
      //     notNull: { msg: 'type must be defined' },
      //     isIn: {
      //       args: [['number', 'string']],
      //       msg: 'type must be "number" or "string"',
      //     },
      //   },
      // },
    },
    {
      sequelize,
      ...sequelize.options,
      modelName: 'panel_item',
    }
  );
  return PanelItem;
};
