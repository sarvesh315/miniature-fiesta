export const errorHandler = (err) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log the complete backtrace locally for internal diagnostics
  console.error(`💥 System Error Intercepted: ${err.message}`);
  console.error(err.stack);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error Encountered',
    stack: process.env.NODE_ENV === 'production' ? '🔒 Hidden' : err.stack
  });
};