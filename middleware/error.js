const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  //console.log(err);
  // prüfen & ggf. ausbauen
  // auch checken, ob die unten genannten Postgres Errors greifen

  // auskommentiert, weil diese Bedingung auf jeden möglichen Fehler zutrifft
  // if (err.name == 'Error') {
  //   const message = 'Resource could not be created';
  //   error = new ErrorResponse(message, 401);
  // }

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

  if (err.name === 'SequelizeUniqueConstraintError') {
    console.log(err);
    // const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse('Object already exists', 400);
  }

  if (err.name === 'SequelizeDatabaseError') {
    error = new ErrorResponse('input is not valid');
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = errorHandler;
