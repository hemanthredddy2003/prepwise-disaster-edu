const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getMyCourses } = require('../controllers/course.controller');

router.get('/my', protect, getMyCourses);

module.exports = router;
