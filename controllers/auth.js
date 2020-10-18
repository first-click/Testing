const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const { sequelize } = require('../models');
const asyncHandler = require('../middleware/async');
const User = sequelize.models.user;

//@desc Register
//@route Post /api/v1/auth/register
//@access Public

exports.register = asyncHandler(async (req, res) => {
  // Insert into table
  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });

  sendTokenResponse(user, 200, res);
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
    attributes: { include: ['password', 'email'] },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

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
  res.cookie('token', 'non', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

//@desc Get currend logged in user
//@route Post /api/v1/auth/me
//@access Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc Update user details
//@route PUT /api/v1/auth/updatedetails
//@access Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const { username, email } = req.body;

  const user = await User.update(
    {
      username: username,
      email: email,
    },
    { where: { id: req.params.id } }
  );

  res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc Update password
//@route PUT /api/v1/auth/updatepassword
//@access Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    where: { id: req.user.id },
    attributes: { include: ['password', 'email'] },
  });

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }
  user.password = req.body.newPassword;

  await user.save();

  sendTokenResponse(user, 200, res);
});

//@desc Forgot password
//@route Post /api/v1/auth/forgotpassword
//@access Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ where: { email: req.body.email } });

  if (!user) {
    return next(new ErrorResponse('There is no user with taht email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// es fehlt die email mit dem token, wollte mich nicht bei einem weiteren email sender anmelden
// const resetToken = user.getResetPasswordToken();
//@desc Reset password
//@route PUT /api/v1/auth/resetpassword/:resettoken
//@access Public

exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256'.update(req.params.resettoken))
    .digest('hex');

  const user = await User.findOne({
    where: {
      resetPasswordToken,
      resPasswordExpire: { $gt: Date.now() },
    },
  });
  if (!user) {
    return next(new ErrorResponse('Invalide token', 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

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
