const express = require('express');
const router = express.Router();
const { getAllShelters, createShelter } = require('../controllers/shelter.controller');
const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

router.get('/',  protect, getAllShelters);
router.post('/', protect, allowRoles('admin','emergency_staff'), createShelter);

module.exports = router;
