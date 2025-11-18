const Minor = require('../models/Minor');
const Question = require('../models/Question');
const { quizBank } = require('./quizBankController');
const { protect } = require('../middleware/authVerify');
const testController = require('./testController');

// List available quizzes (minors)
exports.listQuizzes = async (req, res, next) => {
  try {
    let minors = [];
    // Try DB
    try {
      const dbMinors = await Minor.find().select('-_id id name description');
      if (dbMinors && dbMinors.length) {
        minors = dbMinors.map(m => ({ id: m.id, name: m.name, description: m.description }));
        return res.json({ success: true, count: minors.length, data: minors });
      }
    } catch (e) {
      // ignore DB errors and fallback
    }

    // Fallback to in-memory quizBank
    minors = Object.keys(quizBank).map(id => ({ id, name: id }));
    return res.json({ success: true, count: minors.length, data: minors });
  } catch (err) {
    next(err);
  }
};

// Get questions for a given minor
exports.getQuizByMinor = async (req, res, next) => {
  try {
    const minorId = req.params.minorId;

    // Try DB first: find questions that have weights for this minor
    try {
      const dbQuestions = await Question.find({ [`weights.${minorId}`]: { $exists: true } });
      if (dbQuestions && dbQuestions.length) {
        const sanitized = dbQuestions.map(q => ({ id: q._id.toString(), text: q.text, options: q.options.map(o => o.text) }));
        return res.json({ success: true, count: sanitized.length, data: sanitized });
      }
    } catch (e) {
      // ignore DB errors and fallback
    }

    // Fallback to in-memory quizBank
    const questions = quizBank[minorId];
    if (!questions) return res.status(404).json({ success: false, message: 'Quiz not found' });
    const sanitized = questions.map(q => ({ id: q.id, text: q.question, options: q.options }));
    return res.json({ success: true, count: sanitized.length, data: sanitized });
  } catch (err) {
    next(err);
  }
};

// Submit quiz answers for a minor
// - If DB has questions for this minor: requires auth and delegates to testController.submitTest
// - Otherwise: uses in-memory quizBank to validate answers (public)
exports.submitQuiz = async (req, res, next) => {
  try {
    const minorId = req.params.minorId;
    // Check DB for questions for this minor
    let hasDbQuestions = false;
    try {
      const one = await Question.findOne({ [`weights.${minorId}`]: { $exists: true } });
      hasDbQuestions = !!one;
    } catch (e) {
      hasDbQuestions = false;
    }

    if (hasDbQuestions) {
      // For DB-backed quizzes require authentication — use protect middleware programmatically
      return protect(req, res, async () => {
        // Ensure body has answers in the expected format for testController
        // testController expects { answers: [{ questionId, value }], minorId }
        if (!req.body || !Array.isArray(req.body.answers)) {
          return res.status(400).json({ success: false, message: 'Please provide answers array (questionId + value)' });
        }
        req.body.minorId = minorId;
        return testController.submitTest(req, res, next);
      });
    }

    // Fallback: use in-memory quizBank validation (public)
    const { answers } = req.body; // expect [{ id, answer }]
    if (!answers || !Array.isArray(answers)) return res.status(400).json({ success: false, message: 'Please provide answers array' });
    const questions = quizBank[minorId];
    if (!questions) return res.status(404).json({ success: false, message: 'Quiz not found' });

    let correctCount = 0;
    answers.forEach(ans => {
      const q = questions.find(qi => qi.id === ans.id || qi.id.toString() === ans.id.toString());
      if (q && typeof ans.answer !== 'undefined') {
        if (q.correct === ans.answer) correctCount++;
      }
    });

    return res.json({ success: true, total: questions.length, correct: correctCount, score: Math.round((correctCount / questions.length) * 100) });
  } catch (err) {
    next(err);
  }
};
