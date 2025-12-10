const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  minorId: {
    type: String,
    required: true,
    index: true
  },
  set: {
    type: String, // e.g. 'set1', 'set2'
    required: true
  },
  originalId: { // The 1-based index from the quiz bank (1-10)
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['personality', 'domain', 'psychological'],
    required: true
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [String], // Array of option strings. Order matters for scoring (First=Best)
    required: true,
    validate: v => v.length >= 2
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Composite index for efficient querying
questionSchema.index({ minorId: 1, set: 1 });

module.exports = mongoose.model('Question', questionSchema);
