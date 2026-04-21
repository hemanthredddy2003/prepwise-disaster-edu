const express = require('express');
const router = express.Router();
const { getMyKit, toggleItem, addItem, deleteItem } = require('../controllers/kit.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/',            protect, getMyKit);
router.post('/',           protect, addItem);
router.put('/:id/toggle',  protect, toggleItem);
router.delete('/:id',      protect, deleteItem);

module.exports = router;
