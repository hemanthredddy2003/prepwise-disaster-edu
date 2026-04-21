const express = require('express');
const router = express.Router();
const { getAllAlerts, createAlert, resolveAlert, deleteAlert } = require('../controllers/alert.controller');
const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

router.get('/',            protect, getAllAlerts);
router.post('/',           protect, allowRoles('admin','emergency_staff'), createAlert);
router.put('/:id/resolve', protect, allowRoles('admin','emergency_staff'), resolveAlert);
router.delete('/:id',      protect, allowRoles('admin'), deleteAlert);

module.exports = router;
