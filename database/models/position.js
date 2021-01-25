'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Position extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Position.belongsToMany(models.person, {
        through: 'persons_positions',
        foreignKey: 'position_id',
        // as: 'users',
        // foreignKey: 'position_id',
      });
      Position.belongsTo(models.company, {
        targetKey: 'company_id',
        foreignKey: 'company_id',
      });
    }
  }
  Position.init(
    {
      position_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      company_id: {
        references: {
          model: 'company',
          key: 'company_id',
        },
        type: DataTypes.INTEGER,
      },
      title: DataTypes.STRING,
      area: DataTypes.STRING,
    },
    {
      sequelize,
      ...sequelize.options,
      modelName: 'position',
    }
  );
  return Position;
};
