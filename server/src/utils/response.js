const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({ success: true, message, data });
};

const sendError = (res, message = 'Server error', statusCode = 500) => {
  res.status(statusCode).json({ success: false, message });
};

module.exports = { sendSuccess, sendError };
