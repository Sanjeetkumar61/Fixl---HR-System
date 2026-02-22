const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const {
  markAttendance,
  getMyAttendance,
  checkTodayAttendance,
  getAllAttendance,
  getAttendanceStats
} = require('../controllers/attendanceController');

// Protected routes (all users)
router.post('/', auth, markAttendance);
router.get('/', auth, getMyAttendance);
router.get('/today', auth, checkTodayAttendance);

// Admin only routes
router.get('/all', auth, adminOnly, getAllAttendance);
router.get('/stats', auth, adminOnly, getAttendanceStats);

module.exports = router;
