/**
 * Unified JSON response format helper
 */
export const sendResponse = (res, statusCode, success, message, data = null, meta = {}) => {
  const responsePayload = {
    success,
    message,
    timestamp: new Date()
  };

  if (data !== null) responsePayload.data = data;
  if (Object.keys(meta).length > 0) responsePayload.meta = meta;

  return res.status(statusCode).json(responsePayload);
};

export const successResponse = (res, message = 'Operation successful', data = null, statusCode = 200) => {
  return sendResponse(res, statusCode, true, message, data);
};

export const errorResponse = (res, message = 'An error occurred', statusCode = 400, meta = {}) => {
  return sendResponse(res, statusCode, false, message, null, meta);
};