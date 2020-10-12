const jwt = require('jsonwebtoken');


// generate token
exports.getSigendJwtToken = function (user) {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}
