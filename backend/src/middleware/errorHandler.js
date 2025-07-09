class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error middleware function
const errorMiddleware = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);


  if (!error.statusCode) {
    error.statusCode = 500;
    error.message = 'Internal Server Error';
  }


  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ErrorHandler(message, 404);
  }


  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorHandler(message, 400);
  }


  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorHandler(message, 400);
  }

  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new ErrorHandler(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new ErrorHandler(message, 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default ErrorHandler;
export { errorMiddleware };