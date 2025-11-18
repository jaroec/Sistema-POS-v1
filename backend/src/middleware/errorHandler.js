// src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';

  console.error(new Date().toISOString(), err);

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
};

export default errorHandler;
