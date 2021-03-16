//const jwt = require('jsonwebtoken');
var redis = require('redis');
var JWTR = require('jwt-redis').default;
var redisClient = redis.createClient();
var jwtr = new JWTR(redisClient);
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const { sequelize } = require('../database/models');
const User = sequelize.models.user;
const Person = sequelize.models.person;

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
    // console.log('token', token);
  }
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // console.log('token', token);
  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = await jwtr.verify(token, process.env.JWT_SECRET);
    // console.log('decoded', decoded);
    req.user = await User.findByPk(decoded.user_id);
    // console.log('req.user', req.user);
    next();
  } catch (err) {
    // console.log('err', err);
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
