const express = require('express');
const router = express.Router();
const {
  listQuizzes,
  getQuizByMinor,
  submitQuiz,
} = require('../controllers/quizController');

// Public: list all quizzes
router.get('/', listQuizzes);

// Public: get questions for a quiz/minor
router.get('/:minorId', getQuizByMinor);

// Submit answers (DB-backed requires auth inside controller; in-memory is public)
router.post('/:minorId/submit', submitQuiz);

module.exports = router;
