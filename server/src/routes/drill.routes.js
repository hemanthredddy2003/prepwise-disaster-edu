const express = require('express');
const router = express.Router();
const { getAllDrills, createDrill, updateDrill, deleteDrill } = require('../controllers/drill.controller');
const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

router.get('/',       protect, getAllDrills);
router.post('/',      protect, allowRoles('admin','emergency_staff','teacher'), createDrill);
router.put('/:id',    protect, allowRoles('admin','emergency_staff'), updateDrill);
router.delete('/:id', protect, allowRoles('admin'), deleteDrill);

module.exports = router;
