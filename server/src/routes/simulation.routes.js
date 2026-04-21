const express = require('express');
const router = express.Router();
const { getScenarios, getScenarioById, startSimulation, continueSimulation } = require('../controllers/simulation.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/',          protect, getScenarios);
router.get('/:id',       protect, getScenarioById);
router.post('/start',    protect, startSimulation);
router.post('/continue', protect, continueSimulation);

module.exports = router;
