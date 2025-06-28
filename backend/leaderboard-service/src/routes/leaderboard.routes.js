const express = require('express');
const {
  getEventLeaderboard,
  getParticipantScore,
  updateParticipantScore,
  getTopPerformers,
  getCollegeLeaderboard
} = require('../controllers/leaderboard.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Public routes
router.get('/event/:eventId', getEventLeaderboard);
router.get('/top', getTopPerformers);
router.get('/colleges', getCollegeLeaderboard);

// Protected routes
router.get('/event/:eventId/user/:userId', protect, getParticipantScore);
router.put('/event/:eventId/user/:userId', protect, authorize('admin', 'organizer'), updateParticipantScore);

module.exports = router;