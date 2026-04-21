const express = require("express");
const router = express.Router();
const { getAiQuestion } = require("../controllers/quiz.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/ai-question", protect, getAiQuestion);

module.exports = router;
