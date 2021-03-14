const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  if (err.name == 'Error') {
    const message = 'Resource could not be created';
    error = new ErrorResponse(message, 401);
  }

  if (err.name == 'TypeError') {
    const message = 'Resource could not be created';
    error = new ErrorResponse(message, 401);
  }

  // Postgres bad ObjectId
  if (err.name == 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Postgres duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Object.values merken !!!
  // Sequelize validation error
  if (err.name === 'validationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = errorHandler;
