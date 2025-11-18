const express = require('express');
const {
  getMinors,
  createMinor,
  updateMinor,
  deleteMinor,
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getAnalytics,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authVerify');

const router = express.Router();

// Minor routes (public get, admin for CRUD)
router.get('/minors', getMinors);
router.post('/admin/minors', protect, authorize('admin'), createMinor);
router.put('/admin/minors/:id', protect, authorize('admin'), updateMinor);
router.delete('/admin/minors/:id', protect, authorize('admin'), deleteMinor);

// Question routes (admin only)
router.get('/admin/questions', protect, authorize('admin'), getQuestions);
router.post('/admin/questions', protect, authorize('admin'), createQuestion);
router.put('/admin/questions/:id', protect, authorize('admin'), updateQuestion);
router.delete(
  '/admin/questions/:id',
  protect,
  authorize('admin'),
  deleteQuestion
);

// Analytics (admin only)
router.get('/admin/analytics', protect, authorize('admin'), getAnalytics);

module.exports = router;

