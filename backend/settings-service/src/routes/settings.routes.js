const express = require('express');
const { 
  getUserSettings,
  updateUserSettings,
  getSystemSettings,
  updateSystemSettings
} = require('../controllers/settings.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes are protected
router.use(protect);

// User settings routes
router.get('/user', getUserSettings);
router.put('/user', updateUserSettings);

// System settings routes (admin only)
router.get('/system', authorize('admin'), getSystemSettings);
router.put('/system', authorize('admin'), updateSystemSettings);

module.exports = router;