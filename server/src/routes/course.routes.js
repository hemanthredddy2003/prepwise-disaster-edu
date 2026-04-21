const express = require('express');
const router = express.Router();
const { getAllCourses, getCourseById, createCourse, enrollCourse, completeModule, getMyCourses, getMyCertificates } = require('../controllers/course.controller');
const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

router.get('/',                              protect, getAllCourses);
router.get('/my-courses',                    protect, getMyCourses);
router.get('/my-enrollments',               protect, getMyCourses);   // alias
router.get('/certificates',                  protect, getMyCertificates);
router.get('/:id',                           protect, getCourseById);
router.post('/',                             protect, allowRoles('admin','teacher'), createCourse);
router.post('/:id/enroll',                  protect, enrollCourse);
router.post('/modules/:moduleId/complete',  protect, completeModule);

module.exports = router;
// Progress alias for dashboard
router.get('/progress/my', protect, getMyCourses);

// Alias for frontend
router.get('/enrollments/my', protect, getMyCourses);
router.get('/certificates/my', protect, getMyCertificates);
router.get('/enrollments/my', protect, getMyCourses);
router.get('/certificates/my', protect, getMyCertificates);
router.get('/enrollments/my', protect, getMyCourses);
router.get('/certificates/my', protect, getMyCertificates);
