'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    static associate(models) {
      Company.hasMany(models.user, {
        foreignKey: 'user_id',
      });
      Company.hasMany(models.person, {
        foreignKey: 'person_id',
      });
      Company.hasMany(models.position, {
        foreignKey: 'position_id',
      });
    }
  }
  Company.init(
    {
      company_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      company_name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          len: {
            args: [1, 20],
            msg: 'please use the right length',
          },
        },
      },
    },
    {
      sequelize,
      ...sequelize.options,
      hooks: {
        // beforeCreate: (user) => {
        //   const salt = bcrypt.genSaltSync();
        //   user.password = bcrypt.hashSync(user.password, salt);
        // },
      },
      modelName: 'company',
      tableName: 'companies',
    }
  );

  return Company;
};
