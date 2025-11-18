const mongoose = require('mongoose');

const minorRecommendationSchema = new mongoose.Schema({
  minorId: {
    type: String,
    required: true,
  },
  minorName: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Eligible', 'Potential', 'Not Recommended'],
    required: true,
  },
});

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  responseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Response',
    required: true,
  },
  rankedMinors: {
    type: [minorRecommendationSchema],
    required: true,
  },
  bestFit: {
    type: minorRecommendationSchema,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
recommendationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Recommendation', recommendationSchema);

