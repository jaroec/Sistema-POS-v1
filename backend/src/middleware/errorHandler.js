// src/middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  // If headers already sent, delegate
  if (res.headersSent) return next(err);

  // Standardize error
  const status = err.status || (err.code && err.code === '23505' ? 409 : 500); // example for unique violation
  const message = err.message || 'Internal server error';

  // Log minimal server-side (console)
  console.error(new Date().toISOString(), err);

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
};
