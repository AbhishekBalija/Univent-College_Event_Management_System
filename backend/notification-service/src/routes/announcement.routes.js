const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementsByEvent
} = require('../controllers/announcement.controller');

// Public routes
router.get('/', getAllAnnouncements);
router.get('/:id', getAnnouncementById);
router.get('/event/:eventId', getAnnouncementsByEvent);

// Protected routes (require authentication)
router.use(protect);

// Routes for admins and organizers only
router.post('/', authorize('admin', 'organizer'), createAnnouncement);
router.put('/:id', updateAnnouncement); // Authorization check in controller
router.delete('/:id', deleteAnnouncement); // Authorization check in controller

module.exports = router;