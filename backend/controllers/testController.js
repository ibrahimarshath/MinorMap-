const Question = require('../models/Question');
const Response = require('../models/Response');
const Recommendation = require('../models/Recommendation');
const Minor = require('../models/Minor');

// @desc    Get all active questions
// @route   GET /api/questions
// @access  Private
// @query   minorId (optional) - Filter questions for specific minor
exports.getQuestions = async (req, res, next) => {
  try {
    const { minorId } = req.query;
    
    let questions = await Question.find({ isActive: true }).select('-weights');

    // Format questions for frontend (ensure _id is string)
    const formattedQuestions = questions.map((q) => ({
      _id: q._id.toString(),
      text: q.text,
      options: q.options,
      isActive: q.isActive,
    }));

    res.status(200).json({
      success: true,
      count: formattedQuestions.length,
      data: formattedQuestions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit quiz answers and get recommendations
// @route   POST /api/test/submit
// @access  Private
exports.submitTest = async (req, res, next) => {
  try {
    const { answers, minorId } = req.body;
    const userId = req.user.id;

    // Validation
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide answers array',
      });
    }

    // Get all questions with weights
    const questions = await Question.find({ isActive: true });
    if (questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No questions available',
      });
    }

    // Get all minors
    const minors = await Minor.find();
    const minorMap = {};
    minors.forEach((minor) => {
      minorMap[minor.id] = minor.name;
    });

    // Calculate scores for each minor
    const scores = new Map();
    const maxPossibleWeights = new Map();

    // Initialize scores and max weights
    minors.forEach((minor) => {
      scores.set(minor.id, 0);
      maxPossibleWeights.set(minor.id, 0);
    });

    // Process each answer
    for (const answer of answers) {
      const question = questions.find(
        (q) => q._id.toString() === answer.questionId
      );

      if (!question) {
        continue; // Skip invalid question IDs
      }

      // For each minor, calculate weighted score
      minors.forEach((minor) => {
        const weight = question.weights.get(minor.id) || 0;
        maxPossibleWeights.set(
          minor.id,
          maxPossibleWeights.get(minor.id) + weight
        );

        if (answer.value === true) {
          scores.set(minor.id, scores.get(minor.id) + weight);
        }
      });
    }

    // Calculate final scores (0-10 scale)
    const finalScores = new Map();
    minors.forEach((minor) => {
      const maxWeight = maxPossibleWeights.get(minor.id);
      const rawScore = scores.get(minor.id);
      const finalScore =
        maxWeight > 0 ? (rawScore / maxWeight) * 100 : 0;
      finalScores.set(minor.id, parseFloat(finalScore.toFixed(2)));
    });

    // Determine status for each minor
    const getStatus = (score) => {
      if (score >= 8.0) return 'Eligible';
      if (score >= 6.0) return 'Potential';
      return 'Not Recommended';
    };

    // Create ranked minors array
    const rankedMinors = minors
      .map((minor) => ({
        minorId: minor.id,
        minorName: minor.name,
        score: finalScores.get(minor.id),
        status: getStatus(finalScores.get(minor.id)),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3); // Top 3

    // Save response
    const response = await Response.create({
      userId,
      minorId: minorId || rankedMinors[0].minorId,
      answers: answers.map((a) => ({
        questionId: a.questionId,
        value: a.value,
      })),
      scores: Object.fromEntries(finalScores),
    });

    // Save recommendation
    const recommendation = await Recommendation.create({
      userId,
      responseId: response._id,
      rankedMinors,
      bestFit: rankedMinors[0],
    });

    res.status(200).json({
      success: true,
      message: 'Test submitted successfully',
      data: {
        recommendation: {
          rankedMinors,
          bestFit: rankedMinors[0],
        },
        responseId: response._id.toString(),
        recommendationId: recommendation._id.toString(),
        allScores: Object.fromEntries(finalScores), // Include all minor scores
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user recommendations
// @route   GET /api/recommendations/:userId
// @access  Private
exports.getRecommendations = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Check if user is accessing their own data or is admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource',
      });
    }

    const recommendations = await Recommendation.find({ userId })
      .sort({ createdAt: -1 })
      .populate('responseId', 'minorId createdAt')
      .limit(10);

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single recommendation by ID
// @route   GET /api/recommendations/detail/:recId
// @access  Private
exports.getRecommendationById = async (req, res, next) => {
  try {
    const recId = req.params.recId;

    const recommendation = await Recommendation.findById(recId)
      .populate('userId', 'name email')
      .populate('responseId');

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: 'Recommendation not found',
      });
    }

    // Check authorization
    if (
      recommendation.userId._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource',
      });
    }

    res.status(200).json({
      success: true,
      data: recommendation,
    });
  } catch (error) {
    next(error);
  }
};

