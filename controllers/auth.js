const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const sendEMail = require('../utils/sendEmail');
const { sequelize } = require('../models');
const asyncHandler = require('../middleware/async');
const User = sequelize.models.user;

//@desc Register
//@route Post /api/v1/auth/register
//@access Public

exports.register = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  // Insert into table
  const user = await User.create({
    username,
    email,
    password,
    role,
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
  //delete req.headers.authorization;
  res.set(Authorization, '');

  console.log(res);
  res.cookie('token', '', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

//@desc Get currend logged in user
//@route Get /api/v1/auth/me
//@access Private

// test
// richtige eingeloggte user kommt zurück
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc Update user details
//@route PUT /api/v1/auth/updatedetails/:id
//@access Private

// test
// nur der user, der richtig eingeloggt ist, kann updaten
// update auf Richtigkeit überprüfen

exports.updateDetails = asyncHandler(async (req, res, next) => {
  const { username, email } = req.body;
  //console.log(typeof req.user.id);
  //console.log(typeof req.params.id);
  const user = await User.update(
    {
      username: username,
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

// test
// user kann sich mit neuem password einloggen
// user kann sich nicht mit dem alten password einloggen

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

// test
// hat user resetToken bekommen
// hat user neues password eingegeben und funktioniert es

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ where: { email: req.body.email } });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `Du willst dein Password zurücksetzen. Mache bitte einen PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEMail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });

    res.status(200).json({ success: true, data: 'email sent' });
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
    .update(req.params.resettoken)
    .digest('hex');

  //console.log(resetPasswordToken);

  const user = await User.findOne({
    where: {
      resetPasswordToken,
    },
  });
  if (!user) {
    return next(new ErrorResponse('Invalide token', 400));
  }

  user.password = user.beforeSave(password);
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;
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
