/**
 * API Constants
 * Centralized constants for the MinorMap+ API
 */

// Eligibility Score Thresholds
exports.ELIGIBILITY_THRESHOLDS = {
  ELIGIBLE: 8.0,
  POTENTIAL: 6.0,
};

// Eligibility Status
exports.ELIGIBILITY_STATUS = {
  ELIGIBLE: 'Eligible',
  POTENTIAL: 'Potential',
  NOT_RECOMMENDED: 'Not Recommended',
};

// User Roles
exports.USER_ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
};

// HTTP Status Codes
exports.HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

// Default Pagination
exports.DEFAULT_PAGINATION = {
  LIMIT: 10,
  PAGE: 1,
};

