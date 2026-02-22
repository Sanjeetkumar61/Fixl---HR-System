const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const {
  getAllEmployees,
  getUserById,
  updateUser,
  getStatsOverview
} = require('../controllers/userController');

// Admin only routes
router.get('/stats/overview', auth, adminOnly, getStatsOverview);
router.get('/', auth, adminOnly, getAllEmployees);
router.get('/:id', auth, getUserById);
router.put('/:id', auth, updateUser);

module.exports = router;
