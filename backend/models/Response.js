const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  value: {
    type: Boolean,
    required: true,
  },
});

const responseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  minorId: {
    type: String,
    required: true,
  },
  answers: {
    type: [answerSchema],
    required: true,
  },
  scores: {
    type: Map,
    of: Number,
    default: new Map(),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
responseSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Response', responseSchema);

