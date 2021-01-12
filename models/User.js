'use strict';
const crypto = require('crypto');
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');
var redis = require('redis');
var JWTR = require('jwt-redis').default;

var redisClient = redis.createClient();
var jwtr = new JWTR(redisClient);

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.profile);
      User.hasMany(models.computer);
      User.belongsToMany(models.department, {
        through: 'users_departments',
      });
    }
  }
  User.init(
    {
      user_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
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
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        enum: ['user', 'publisher', 'admin'],
        default: 'user',
      },
      reset_password_token: DataTypes.STRING,
      reset_password_expire: DataTypes.DATE,
    },
    {
      sequelize,
      ...sequelize.options,
      hooks: {
        beforeCreate: (user) => {
          const salt = bcrypt.genSaltSync();
          user.password = bcrypt.hashSync(user.password, salt);
        },
      },
      // createdAt: 'created_at',
      // updatedAt: 'updated_at',
      modelName: 'user',
    }
  );
  User.prototype.beforeSave = function (password) {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
  };
  // Sign JWT and return
  // User.prototype.getSignedJwtToken = function () {
  //   return jwtr.sign({ id: this.id }, process.env.JWT_SECRET, {
  //     expiresIn: process.env.JWT_EXPIRE,
  //   });
  // };

  User.prototype.getSignedJwtToken = function () {
    // Create a token
    return jwtr.sign({ user_id: this.user_id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  };

  User.prototype.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  // Generate and hash password token
  User.prototype.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.reset_password_token = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire
    this.reset_password_expire = Date.now() + 10 * 60 * 1000;

    return resetToken;
  };

  return User;
};
