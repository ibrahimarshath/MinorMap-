const express = require('express');
const router = express.Router();
const {
  listQuizzes,
  getQuizByMinor,
  submitQuiz,
} = require('../controllers/quizController');

// Public endpoints for quiz bank (mapping legacy routes to new controller)
router.get('/quizbank', listQuizzes);
router.get('/quizbank/:minorId/questions', getQuizByMinor);
router.post('/quizbank/validate', submitQuiz);

module.exports = router;
