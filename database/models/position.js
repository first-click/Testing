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
        through: models.person_position,

        foreignKey: 'position_id',
      });

      Position.belongsTo(models.company, {
        foreignKey: 'company_id',
      });
      Position.hasMany(models.posting, {
        foreignKey: 'position_id',
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
        allowNull: false,
        references: {
          model: 'company',
          key: 'company_id',
        },
        type: DataTypes.INTEGER,
      },

      title: { allowNull: false, type: DataTypes.STRING },
      department: { allowNull: false, type: DataTypes.STRING },
      department_short: { allowNull: false, type: DataTypes.STRING },
    },
    {
      sequelize,
      ...sequelize.options,
      modelName: 'position',
    }
  );
  return Position;
};
