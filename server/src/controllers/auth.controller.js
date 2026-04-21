const User = require('../models/mysql/User');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/response');

const register = async (req, res) => {
  try {
    const { name, email, password, role, institution } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 'Name, email and password are required.', 400);
    }
    if (password.length < 6) {
      return sendError(res, 'Password must be at least 6 characters.', 400);
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return sendError(res, 'Email already registered. Please login.', 409);
    }

    const password_hash = await hashPassword(password);
    const user = await User.create({
      name, email, password_hash,
      role: role || 'student',
      institution: institution || null,
    });

    const token = generateToken({ id: user.id, role: user.role });

    return sendSuccess(res, {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        institution: user.institution,
      }
    }, 'Registration successful!', 201);

  } catch (err) {
    console.error('Register error:', err);
    return sendError(res, 'Registration failed. Please try again.', 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Email and password are required.', 400);
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return sendError(res, 'Invalid email or password.', 401);
    }
    if (!user.is_active) {
      return sendError(res, 'Account deactivated. Contact admin.', 403);
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password.', 401);
    }

    const token = generateToken({ id: user.id, role: user.role });

    return sendSuccess(res, {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        institution: user.institution,
      }
    }, 'Login successful!');

  } catch (err) {
    console.error('Login error:', err);
    return sendError(res, 'Login failed. Please try again.', 500);
  }
};

const getMe = async (req, res) => {
  try {
    return sendSuccess(res, {
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        institution: req.user.institution,
        created_at: req.user.created_at,
      }
    }, 'User fetched.');
  } catch (err) {
    return sendError(res, 'Could not fetch user.', 500);
  }
};

module.exports = { register, login, getMe };
