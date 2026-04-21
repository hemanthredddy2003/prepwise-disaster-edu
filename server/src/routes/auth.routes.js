const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login',    login);
router.get('/me',        protect, getMe);

module.exports = router;

// Aliases for frontend compatibility
router.get('/profile', protect, getMe);
router.get('/users',   protect, async (req, res) => {
  const { User } = require('../models/mysql');
  const users = await User.findAll({ attributes: ['id','name','email','role','created_at'], limit: 50 });
  res.json({ success: true, data: { users } });
});
