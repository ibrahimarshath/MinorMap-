const Minor = require('../models/Minor');
const Question = require('../models/Question');
const Response = require('../models/Response');
const Recommendation = require('../models/Recommendation');
const User = require('../models/User');

// ========== MINOR MANAGEMENT ==========

// @desc    Get all minors
// @route   GET /api/minors
// @access  Public
exports.getMinors = async (req, res, next) => {
  try {
    const minors = await Minor.find().sort({ name: 1 });

    // Format minors for frontend (ensure _id is string)
    const formattedMinors = minors.map((minor) => ({
      _id: minor._id.toString(),
      id: minor.id,
      name: minor.name,
      description: minor.description,
    }));

    res.status(200).json({
      success: true,
      count: formattedMinors.length,
      data: formattedMinors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new minor
// @route   POST /api/admin/minors
// @access  Private/Admin
exports.createMinor = async (req, res, next) => {
  try {
    const { id, name, description } = req.body;

    if (!id || !name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide id, name, and description',
      });
    }

    const minor = await Minor.create({ id, name, description });

    res.status(201).json({
      success: true,
      message: 'Minor created successfully',
      data: minor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update minor
// @route   PUT /api/admin/minors/:id
// @access  Private/Admin
exports.updateMinor = async (req, res, next) => {
  try {
    const minor = await Minor.findOne({ id: req.params.id });

    if (!minor) {
      return res.status(404).json({
        success: false,
        message: 'Minor not found',
      });
    }

    const updatedMinor = await Minor.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Minor updated successfully',
      data: updatedMinor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete minor
// @route   DELETE /api/admin/minors/:id
// @access  Private/Admin
exports.deleteMinor = async (req, res, next) => {
  try {
    const minor = await Minor.findOne({ id: req.params.id });

    if (!minor) {
      return res.status(404).json({
        success: false,
        message: 'Minor not found',
      });
    }

    await Minor.findOneAndDelete({ id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Minor deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// ========== QUESTION MANAGEMENT ==========

// @desc    Get all questions (with weights for admin)
// @route   GET /api/admin/questions
// @access  Private/Admin
exports.getQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new question
// @route   POST /api/admin/questions
// @access  Private/Admin
exports.createQuestion = async (req, res, next) => {
  try {
    const { text, options, weights } = req.body;

    if (!text || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide text and at least 2 options',
      });
    }

    const question = await Question.create({
      text,
      options,
      weights: weights || new Map(),
    });

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update question
// @route   PUT /api/admin/questions/:id
// @access  Private/Admin
exports.updateQuestion = async (req, res, next) => {
  try {
    let question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete question
// @route   DELETE /api/admin/questions/:id
// @access  Private/Admin
exports.deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    await Question.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// ========== ANALYTICS ==========

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res, next) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments({ role: 'student' });

    // Total responses
    const totalResponses = await Response.countDocuments();

    // Minor popularity (count responses per minor)
    const minorStats = await Response.aggregate([
      {
        $group: {
          _id: '$minorId',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Get minor names
    const minors = await Minor.find();
    const minorMap = {};
    minors.forEach((minor) => {
      minorMap[minor.id] = minor.name;
    });

    const minorPopularity = minorStats.map((stat) => ({
      minorId: stat._id,
      minorName: minorMap[stat._id] || stat._id,
      responseCount: stat.count,
    }));

    // Average scores per minor
    const avgScores = await Recommendation.aggregate([
      {
        $unwind: '$rankedMinors',
      },
      {
        $group: {
          _id: '$rankedMinors.minorId',
          avgScore: { $avg: '$rankedMinors.score' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { avgScore: -1 },
      },
    ]);

    const averageScores = avgScores.map((stat) => ({
      minorId: stat._id,
      minorName: minorMap[stat._id] || stat._id,
      averageScore: parseFloat(stat.avgScore.toFixed(2)),
      testCount: stat.count,
    }));

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalResponses,
        minorPopularity,
        averageScores,
      },
    });
  } catch (error) {
    next(error);
  }
};

