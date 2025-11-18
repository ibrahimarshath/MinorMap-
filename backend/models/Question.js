const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  value: {
    type: Boolean,
    required: true,
  },
});

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please provide question text'],
    trim: true,
  },
  options: {
    type: [optionSchema],
    required: true,
    validate: {
      validator: function (v) {
        return v.length >= 2;
      },
      message: 'Question must have at least 2 options',
    },
  },
  // Weights for each minor: { 'ai-ml': 2, 'data-science': 3, ... }
  weights: {
    type: Map,
    of: Number,
    default: new Map(),
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

questionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Question', questionSchema);

