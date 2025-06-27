const Announcement = require('../models/Announcement');

/**
 * @desc    Create a new announcement
 * @route   POST /api/announcements
 * @access  Private (Organizers and Admins only)
 */
exports.createAnnouncement = async (req, res, next) => {
  try {
    const { title, content, eventId, priority, isPublished } = req.body;
    
    // Get user info from request (set by auth middleware)
    const userId = req.user.id;
    
    // Set creator name based on available information
    let creatorName = req.body.creatorName;
    if (!creatorName && req.user && req.user.firstName && req.user.lastName) {
      creatorName = `${req.user.firstName} ${req.user.lastName}`;
    }
    if (!creatorName) {
      creatorName = 'System';
    }
    
    // Create new announcement
    const announcement = await Announcement.create({
      title,
      content,
      eventId: eventId || null,
      createdBy: userId,
      creatorName,
      priority: priority || 'medium',
      isPublished: isPublished !== undefined ? isPublished : true
    });
    
    // If socket.io is initialized, emit the new announcement
    if (req.io) {
      req.io.emit('newAnnouncement', {
        announcement
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: announcement
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all announcements
 * @route   GET /api/announcements
 * @access  Public
 */
exports.getAllAnnouncements = async (req, res, next) => {
  try {
    // Build query based on request query parameters
    const query = {};
    
    // Filter by eventId if provided
    if (req.query.eventId) {
      query.eventId = req.query.eventId;
    }
    
    // Filter by priority if provided
    if (req.query.priority) {
      query.priority = req.query.priority;
    }
    
    // Only show published announcements for non-admin/organizer users
    if (req.user && (req.user.role === 'admin' || req.user.role === 'organizer')) {
      // Admin and organizers can see all announcements
      if (req.query.isPublished !== undefined) {
        query.isPublished = req.query.isPublished === 'true';
      }
    } else {
      // Regular users can only see published announcements
      query.isPublished = true;
    }
    
    // Get announcements
    const announcements = await Announcement.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get announcement by ID
 * @route   GET /api/announcements/:id
 * @access  Public (with restrictions)
 */
exports.getAnnouncementById = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }
    
    // Check if announcement is published or user is admin/organizer
    if (!announcement.isPublished && 
        (!req.user || (req.user.role !== 'admin' && req.user.role !== 'organizer'))) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this announcement'
      });
    }
    
    res.status(200).json({
      success: true,
      data: announcement
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update announcement
 * @route   PUT /api/announcements/:id
 * @access  Private (Announcement creator or Admin only)
 */
exports.updateAnnouncement = async (req, res, next) => {
  try {
    let announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }
    
    // Check if user is authorized to update this announcement
    if (announcement.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this announcement'
      });
    }
    
    // Update announcement
    announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    // If socket.io is initialized, emit the updated announcement
    if (req.io) {
      req.io.emit('updateAnnouncement', {
        announcement
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Announcement updated successfully',
      data: announcement
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete announcement
 * @route   DELETE /api/announcements/:id
 * @access  Private (Announcement creator or Admin only)
 */
exports.deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }
    
    // Check if user is authorized to delete this announcement
    if (announcement.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this announcement'
      });
    }
    
    await announcement.deleteOne();
    
    // If socket.io is initialized, emit the deleted announcement
    if (req.io) {
      req.io.emit('deleteAnnouncement', {
        id: req.params.id
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get announcements for an event
 * @route   GET /api/announcements/event/:eventId
 * @access  Public
 */
exports.getAnnouncementsByEvent = async (req, res, next) => {
  try {
    const query = {
      eventId: req.params.eventId,
      isPublished: true
    };
    
    // Admin and organizers can see unpublished announcements
    if (req.user && (req.user.role === 'admin' || req.user.role === 'organizer')) {
      delete query.isPublished;
    }
    
    const announcements = await Announcement.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements
    });
  } catch (error) {
    next(error);
  }
};