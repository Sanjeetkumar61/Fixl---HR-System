const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const {
  applyLeave,
  getMyLeaves,
  updateLeave,
  cancelLeave,
  getAllLeaves,
  updateLeaveStatus,
  getLeaveStats
} = require('../controllers/leaveController');

// Protected routes (all users)
router.post('/', auth, applyLeave);
router.get('/', auth, getMyLeaves);
router.put('/:id', auth, updateLeave);
router.delete('/:id', auth, cancelLeave);

// Admin only routes
router.get('/all', auth, adminOnly, getAllLeaves);
router.put('/:id/status', auth, adminOnly, updateLeaveStatus);
router.get('/stats', auth, adminOnly, getLeaveStats);

module.exports = router;
