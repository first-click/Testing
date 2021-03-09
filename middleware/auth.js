//const jwt = require('jsonwebtoken');
var redis = require('redis');
var JWTR = require('jwt-redis').default;
var redisClient = redis.createClient();
var jwtr = new JWTR(redisClient);
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const { sequelize } = require('../database/models');
const User = sequelize.models.user;
const Role_user = sequelize.models.role_user;

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
    // Set token from cookie
  }
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = await jwtr.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.user_id);
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

exports.authorizePosting = (...roles) => {
  return async (req, res, next) => {
    const role = await Role_user.findAll({
      where: { user_id: req.user.user_id },
    });

    if (!roles.includes(role)) {
      return next(
        new ErrorResponse(`User is not authorized to create a panel`, 403)
      );
    }
    next();
  };
};
