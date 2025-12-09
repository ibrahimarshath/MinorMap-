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
    console.log("Fetching minors...");
    try {
      const dbMinors = await Minor.find().select('-_id id name description');
      if (dbMinors && dbMinors.length) {
        minors = dbMinors.map(m => ({ id: m.id, name: m.name, description: m.description }));
        return res.json({ success: true, count: minors.length, data: minors });
      }
    } catch (e) {
      // ignore DB errors and fallback
      console.log("DB Fetch failed, falling back to file data.");
    }

    // Fallback to in-memory quizBank
    minors = Object.keys(quizBank).map(key => ({
      id: key,
      name: quizBank[key].minor || key,
      description: quizBank[key].minor
    }));
    return res.json({ success: true, count: minors.length, data: minors });
  } catch (err) {
    next(err);
  }
};

// Get questions for a given minor
exports.getQuizByMinor = async (req, res, next) => {
  try {
    const minorId = req.params.minorId;

    // Prevent caching to ensure random set selection works on every request
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');

    // Try DB first: find questions that have weights for this minor
    try {
      const dbQuestions = await Question.find({ [`weights.${minorId}`]: { $exists: true } });
      if (dbQuestions && dbQuestions.length) {
        const sanitized = dbQuestions.map(q => ({
          id: q._id.toString(),
          question: q.text,
          options: q.options.map(o => o.text)
        }));
        return res.json({ success: true, count: sanitized.length, data: sanitized });
      }
    } catch (e) {
      // ignore DB errors and fallback
    }

    // Fallback to in-memory quizBank
    const minorData = quizBank[minorId];
    if (!minorData) return res.status(404).json({ success: false, message: 'Quiz not found' });

    // Randomly select one set
    const sets = minorData.sets;
    if (!sets) return res.json({ success: true, count: 0, data: [] });

    const setKeys = Object.keys(sets);
    if (setKeys.length === 0) return res.json({ success: true, count: 0, data: [] });

    // Select a random set
    const randomKey = setKeys[Math.floor(Math.random() * setKeys.length)];
    const questions = sets[randomKey];

    // Map to sanitized format
    const sanitized = questions.map(q => ({
      id: q.id,
      question: q.question, // Frontend expects 'question' property
      type: q.type,
      options: q.options
    }));

    return res.json({ success: true, count: sanitized.length, data: sanitized, set: randomKey });
  } catch (err) {
    next(err);
  }
};

// Submit quiz answers for a minor
exports.submitQuiz = async (req, res, next) => {
  try {
    const minorId = req.params.minorId || req.body.minorId;
    // Check DB for questions for this minor
    let hasDbQuestions = false;
    try {
      const one = await Question.findOne({ [`weights.${minorId}`]: { $exists: true } });
      hasDbQuestions = !!one;
    } catch (e) {
      hasDbQuestions = false;
    }

    if (hasDbQuestions) {
      return protect(req, res, async () => {
        if (!req.body || !Array.isArray(req.body.answers)) {
          return res.status(400).json({ success: false, message: 'Please provide answers array (questionId + value)' });
        }
        req.body.minorId = minorId;
        return testController.submitTest(req, res, next);
      });
    }

    // Fallback: use in-memory quizBank validation
    const { answers, setId } = req.body;
    if (!answers || !Array.isArray(answers)) return res.status(400).json({ success: false, message: 'Please provide answers array' });

    const minorData = quizBank[minorId];
    if (!minorData) return res.status(404).json({ success: false, message: 'Quiz not found' });

    // 1. Identify which set these answers likely belong to.
    const sets = minorData.sets || {};
    let bestSetKey = null;

    if (setId && sets[setId]) {
      bestSetKey = setId;
    } else {
      // Legacy/Fallback matching logic
      let maxMatches = -1;

      Object.keys(sets).forEach(key => {
        const questions = sets[key];
        let matches = 0;
        answers.forEach(ans => {
          if (questions.find(q => q.id == ans.id)) matches++;
        });
        if (matches > maxMatches) {
          maxMatches = matches;
          bestSetKey = key;
        }
      });

      if (!bestSetKey || maxMatches === 0) {
        return res.status(400).json({ success: false, message: "Answers do not match any known question set." });
      }
    }

    const questionSet = sets[bestSetKey];

    // 2. Calculate scores
    let personalityScore = 0;
    let domainScore = 0;
    let psychologicalScore = 0;

    let maxPersonality = 0;
    let maxDomain = 0;
    let maxPsychological = 0;

    // Iterate over the questions in the matched set to determine max scores and user scores
    questionSet.forEach(question => {
      const maxPointsForQuestion = 3; // 4 options (0-3), best score is 3.

      if (question.type === 'personality') maxPersonality += maxPointsForQuestion;
      else if (question.type === 'domain') maxDomain += maxPointsForQuestion;
      else if (question.type === 'psychological') maxPsychological += maxPointsForQuestion;

      const userAnswer = answers.find(a => a.id == question.id);
      if (userAnswer) {
        // Find index of the selected answer string
        const index = question.options.indexOf(userAnswer.answer);
        if (index !== -1) {
          const score = 3 - index;
          if (question.type === 'personality') personalityScore += score;
          else if (question.type === 'domain') domainScore += score;
          else if (question.type === 'psychological') psychologicalScore += score;
        }
      }
    });

    // calculate ratios (avoid div/0)
    const personalityRatio = maxPersonality > 0 ? personalityScore / maxPersonality : 0;
    const domainRatio = maxDomain > 0 ? domainScore / maxDomain : 0;
    const psychologicalRatio = maxPsychological > 0 ? psychologicalScore / maxPsychological : 0;

    // Weighted final score
    // (Domain * 0.5) + (Personality * 0.3) + (Psychological * 0.2)
    const finalScore =
      (domainRatio * 0.5) +
      (personalityRatio * 0.3) +
      (psychologicalRatio * 0.2);

    let eligibility = "";
    if (finalScore >= 0.75) {
      eligibility = "Highly Eligible";
    } else if (finalScore >= 0.55) {
      eligibility = "Moderately Eligible";
    } else {
      eligibility = "Not a Good Fit";
    }

    return res.json({
      success: true,
      eligibility,
      finalScore: parseFloat(finalScore.toFixed(2)),
      breakdown: {
        personality: parseFloat(personalityRatio.toFixed(2)),
        domain: parseFloat(domainRatio.toFixed(2)),
        psychological: parseFloat(psychologicalRatio.toFixed(2))
      }
    });
  } catch (err) {
    next(err);
  }
};
