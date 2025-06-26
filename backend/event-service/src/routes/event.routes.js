const express = require('express');
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  cancelRegistration,
  getEventParticipants
} = require('../controllers/event.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Protected routes (require authentication)
router.post('/', protect, authorize('organizer', 'admin'), createEvent);
router.put('/:id', protect, updateEvent); // Authorization check in controller
router.delete('/:id', protect, deleteEvent); // Authorization check in controller

// Registration routes
router.post('/:id/register', protect, registerForEvent);
router.delete('/:id/register', protect, cancelRegistration);

// Participants route
router.get('/:id/participants', protect, getEventParticipants); // Authorization check in controller

module.exports = router;