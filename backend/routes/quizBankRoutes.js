const express = require('express');
const router = express.Router();
const {
  listMinors,
  getMinorQuestions,
  validateAnswers,
} = require('../controllers/quizBankController');

// Public endpoints for quiz bank
router.get('/quizbank', listMinors);
router.get('/quizbank/:minorId/questions', getMinorQuestions);
router.post('/quizbank/validate', validateAnswers);

module.exports = router;
