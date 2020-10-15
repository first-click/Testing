'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // static associate(models) {
    //   // Shop hasMany Coffees
    //   Shop.hasMany(models.Coffee);
    // }
  }
  User.init(
    {
      username: {
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
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },

    {
      hooks: {
        beforeCreate: (user) => {
          const salt = bcrypt.genSaltSync();
          user.password = bcrypt.hashSync(user.password, salt);
        },

        // beforeBulkUpdate: function async(user) {
        //   console.log(user);
        //   if (user.password) {
        //     return bcrypt.compareSync(password, this.password);
        //   }
        // },
        // beforeBulkUpdate: async (user) => {
        //   console.log('hallo');
        //   if (user.password) {
        //     user.password = await bcrypt.hashSync(
        //       user.previous.password,
        //       bcrypt.genSaltSync(10),
        //       null
        //     );
        //   }
        // },
      },
      instanceMethods: {
        validPassword: function (password) {
          return bcrypt.compareSync(password, this.password);
        },
      },
      sequelize,
      modelName: 'user',
    }
  );
  return User;
};
