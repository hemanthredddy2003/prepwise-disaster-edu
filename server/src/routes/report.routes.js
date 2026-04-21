const express = require('express');
const router = express.Router();
const { getAllReports, createReport, updateReportStatus, getMyReports } = require('../controllers/report.controller');
const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

router.get('/',            protect, allowRoles('admin','emergency_staff','teacher'), getAllReports);
router.get('/my-reports',  protect, getMyReports);
router.post('/',           protect, createReport);
router.put('/:id/status',  protect, allowRoles('admin','emergency_staff'), updateReportStatus);

module.exports = router;
