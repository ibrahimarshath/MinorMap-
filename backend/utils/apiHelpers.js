/**
 * API Helper Utilities
 * Common functions for API responses and data formatting
 */

// Standard API response format
exports.sendResponse = (res, statusCode, success, message, data = null) => {
  const response = {
    success,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

// Format question for frontend (remove weights, ensure _id is string)
exports.formatQuestion = (question) => {
  return {
    _id: question._id.toString(),
    text: question.text,
    options: question.options,
    isActive: question.isActive,
  };
};

// Format user data (remove sensitive info)
exports.formatUser = (user) => {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

// Validate email format
exports.isValidEmail = (email) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

// Calculate eligibility status from score
exports.getEligibilityStatus = (score) => {
  if (score >= 8.0) return 'Eligible';
  if (score >= 6.0) return 'Potential';
  return 'Not Recommended';
};

