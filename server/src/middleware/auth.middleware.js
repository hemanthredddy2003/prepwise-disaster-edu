const { verifyToken } = require('../utils/jwt');
const { sendError } = require('../utils/response');
const User = require('../models/mysql/User');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'No token provided. Please login.', 401);
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password_hash'] }
    });
    if (!user || !user.is_active) {
      return sendError(res, 'User not found or deactivated.', 401);
    }
    req.user = user;
    next();
  } catch (err) {
    return sendError(res, 'Invalid or expired token. Please login again.', 401);
  }
};

module.exports = { protect, authenticateToken: protect };
