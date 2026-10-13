const notFoundHandler = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error.code === 11000) {
    return res.status(409).json({ message: 'An account with this email already exists' });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ message: error.message });
  }

  const statusCode = error.statusCode || error.status || 500;
  const message = statusCode >= 500 ? 'Internal server error' : error.message;

  return res.status(statusCode).json({ message });
};

module.exports = { notFoundHandler, errorHandler };
