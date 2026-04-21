const express = require('express');
const router = express.Router();
const { getAllResources, createResource, deleteResource } = require('../controllers/resource.controller');
const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

router.get('/',       protect, getAllResources);
router.post('/',      protect, allowRoles('admin','teacher'), createResource);
router.delete('/:id', protect, allowRoles('admin'), deleteResource);

module.exports = router;
