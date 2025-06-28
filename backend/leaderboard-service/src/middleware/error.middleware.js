/**
 * Error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Default error object
  let error = {
    success: false,
    message: err.message || 'Server Error',
    errors: null,
    stack: process.env.NODE_ENV === 'development' ? err.stack : null
  };

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    error.message = 'Invalid input data';
    error.errors = messages;
    return res.status(400).json(error);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    error.message = 'Duplicate field value entered';
    const field = Object.keys(err.keyValue)[0];
    error.errors = [`${field} already exists`];
    return res.status(400).json(error);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error.message = `Resource not found with id of ${err.value}`;
    return res.status(404).json(error);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    return res.status(401).json(error);
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    return res.status(401).json(error);
  }

  // Default server error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json(error);
};

module.exports = errorHandler;