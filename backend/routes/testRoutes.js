const express = require('express');
const {
  getQuestions,
  submitTest,
  getRecommendations,
  getRecommendationById,
} = require('../controllers/testController');
const { protect } = require('../middleware/authVerify');

const router = express.Router();

router.get('/questions', protect, getQuestions);
router.post('/submit', protect, submitTest);
router.get('/recommendations/:userId', protect, getRecommendations);
router.get('/recommendations/detail/:recId', protect, getRecommendationById);

module.exports = router;

