const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
const protect = async (req, res, next) => {
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
  //     token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    return next(console.log('not auth'), 401);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findByPk(decoded.id);

    console.log(req.user);

    next();
  } catch (err) {
    return next(console.log('not auth'), 401);
  }
};
