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
    // console.log('token', token);
  }
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // console.log('token', token);
  // Make sure token exists
  if (!token) {
    // console.log('no token');
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
    // console.log('other error');
    // console.log('err', err);
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// Grant access to specific roles
// noch genau schauen, wer was sehen darf
exports.authorize = (...roles) => {
  return async (req, res, next) => {
    const role = await Role_user.findOne({
      where: {
        user_id: req.user.user_id,
        role_user: [
          'admin',
          'user',
          'publisher',
          'posting_creator',
          'posting_applicant',
        ],
      },
    });

    if (!roles.includes(role.role_user)) {
      return next(
        new ErrorResponse(`User is not authorized to access this route`, 403)
      );
    }
    next();
  };
};

exports.authorizePosting = (...roles) => {
  return async (req, res, next) => {
    const role = await Role_user.findOne({
      where: { user_id: req.user.user_id },
    });

    if (!roles.includes(role.role_user)) {
      return next(new ErrorResponse(`User is not authorized`, 403));
    }
    next();
  };
};
