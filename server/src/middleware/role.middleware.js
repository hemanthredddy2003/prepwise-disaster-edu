const { sendError } = require('../utils/response');

const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Not authenticated.', 401);
    }
    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        `Access denied. Required: ${roles.join(' or ')}. Your role: ${req.user.role}`,
        403
      );
    }
    next();
  };
};

module.exports = { allowRoles };
