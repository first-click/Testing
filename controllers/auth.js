const crypto = require('crypto');
var redis = require('redis');
var JWTR = require('jwt-redis').default;
var redisClient = redis.createClient();
var jwtr = new JWTR(redisClient);
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const { sequelize } = require('../models');
const asyncHandler = require('../middleware/async');
const User = sequelize.models.user;

//@desc Register
//@route Post /api/v1/auth/register
//@access Public

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  //Check for user
  const userExists = await User.findOne({
    where: { email: email },
  });
  if (userExists) {
    return next(new ErrorResponse('User already exists', 401));
  } else {
    // Insert into table
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    sendTokenResponse(user, 200, res);
  }
});

//@desc Login user
//@route Post /api/v1/auth/login
//@access Public

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  //Check for user
  const user = await User.findOne({
    where: { email: email },
    attributes: ['id', 'password', 'email'],
  });

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
  //console.log(user);
  //Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

//@desc Log user out / clear cookie
//@route GET /api/v1/auth/logout
//@access Private

exports.logout = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
    // Set token from cookie
  }

  const decoded = await jwtr.decode(token, process.env.JWT_SECRET);

  res.clearCookie('token');
  // res.cookie('token', '', {
  //   expires: new Date(Date.now() + 10 * 1000),
  //   httpOnly: true,
  // });

  await jwtr.destroy(decoded.jti, process.env.JWT_SECRET);

  // console.log(token);

  res.status(200).json({
    success: true,
    data: {},
  });
});

//@desc Get currend logged in user
//@route Get /api/v1/auth/me
//@access Private

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.user.id, {
    attributes: {
      exclude: ['password', 'resetPasswordToken', 'resetPasswordExpire'],
    },
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc Update user details
//@route PUT /api/v1/auth/updatedetails/:id
//@access Private

exports.updateDetails = asyncHandler(async (req, res, next) => {
  const { name, email } = req.body;
  //console.log(typeof req.user.id);
  //console.log(typeof req.params.id);
  const user = await User.update(
    {
      name: name,
      email: email,
    },
    { where: { id: req.user.id.toString() } }
  );

  res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc Update password
//@route PUT /api/v1/auth/updatepassword/:id
//@access Private

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    where: { id: req.params.id },
  });

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = user.beforeSave(req.body.newPassword);

  await user.save();

  sendTokenResponse(user, 200, res);
});

//@desc Forgot password
//@route Post /api/v1/auth/forgotpassword
//@access Public

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ where: { email: req.body.email } });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  //console.log(resetToken);

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `Du willst dein Password zurücksetzen. Mache bitte einen PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });

    res.status(200).json({ success: true, data: 'email sent', resetToken });
  } catch (err) {
    //console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('Email could not be send', 500));
  }
});

//@desc Reset password
//@route PUT /api/v1/auth/resetpassword/:resettoken
//@access Public

// test
// funktioniert das neue Passwort
// geht das alte Passwort nicht mehr

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { password } = req.body;
  // Get hashed token

  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  //console.log(resetPasswordToken);

  const user = await User.findOne({
    where: {
      resetPasswordToken,
      //  resetPasswordExpire: { $gte: Date.now() },
    },
  });
  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  user.password = user.beforeSave(password);
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = async (user, statusCode, res) => {
  // Create token
  const token = await user.getSignedJwtToken();
  // console.log(token);

  // Token verification
  jwtr.verify(token, process.env.JWT_SECRET);

  // wozu habe ich die options drin?
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};
