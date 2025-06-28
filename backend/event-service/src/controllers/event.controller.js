const Event = require('../models/Event');
const axios = require('axios');

/**
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  Private (Organizers and Admins only)
 */
exports.createEvent = async (req, res, next) => {
  try {
    const { title, description, date, location, capacity, tags, image } = req.body;
    
    // Get user info from request (set by auth middleware)
    const userId = req.user.id; // Use id directly from JWT token
    
    // Check if firstName and lastName are available in the token
    // If not, use a default value or extract from request body if provided
    let organizerName = 'Event Organizer'; // Default value
    
    if (req.body.organizerName) {
      // If client provides the organizer name, use it
      organizerName = req.body.organizerName;
    } else if (req.user.firstName && req.user.lastName) {
      // If available in the token (future-proofing)
      organizerName = `${req.user.firstName} ${req.user.lastName}`;
    }
    
    // Create new event
    const event = await Event.create({
      title,
      description,
      date,
      location,
      capacity: parseInt(capacity, 10),
      tags: tags || [],
      createdBy: userId,
      organizerName,
      image: image || ''
    });
    
    // Send announcement to notification-service
    try {
      await axios.post('http://localhost:8003/api/announcements', {
        title: `New Event: ${title}`,
        content: `A new event '${title}' has been announced by ${organizerName}.`,
        eventId: event._id,
        priority: 'high',
        creatorName: organizerName,
        isPublished: true
      }, {
        headers: {
          Authorization: req.headers['authorization'] || ''
        }
      });
    } catch (announceErr) {
      console.error('Failed to announce new event:', announceErr.message);
    }
    
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all events
 * @route   GET /api/events
 * @access  Public
 */
exports.getAllEvents = async (req, res, next) => {
  try {
    // Build query based on request query parameters
    const query = {};
    
    // Filter by tags if provided
    if (req.query.tags) {
      const tags = req.query.tags.split(',');
      query.tags = { $in: tags };
    }
    
    // Filter by date range if provided
    if (req.query.startDate && req.query.endDate) {
      query.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    } else if (req.query.startDate) {
      query.date = { $gte: new Date(req.query.startDate) };
    } else if (req.query.endDate) {
      query.date = { $lte: new Date(req.query.endDate) };
    }
    
    // Filter by organizer if provided
    if (req.query.organizer) {
      query.createdBy = req.query.organizer;
    }
    
    // Get events
    const events = await Event.find(query).sort({ date: 1 });
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get event by ID
 * @route   GET /api/events/:id
 * @access  Public
 */
exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update event
 * @route   PUT /api/events/:id
 * @access  Private (Event creator or Admin only)
 */
exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Check if user is authorized to update this event
    if (event.createdBy.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }
    
    // Update event
    event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete event
 * @route   DELETE /api/events/:id
 * @access  Private (Event creator or Admin only)
 */
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Check if user is authorized to delete this event
    if (event.createdBy.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }
    
    await event.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Register for event
 * @route   POST /api/events/:id/register
 * @access  Private
 */
exports.registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Check if event is in the past
    if (new Date(event.date) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot register for past events'
      });
    }
    
    // Check if event is full
    if (event.participants.length >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Event is at full capacity'
      });
    }
    
    // Check if user is already registered
    if (event.isUserRegistered(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }
    
    // Get registration details from request body
    const { specialRequirements, name, email } = req.body;
    
    // Add user to participants
    event.participants.push({
      userId: req.user.id,
      name: name || `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || 'Participant', // Use provided name or default
      email: email || req.user.email || 'No email provided', // Use provided email or default
      college: req.user.college || 'No college', // Add college information
      specialRequirements: specialRequirements || ''
    });
    
    await event.save();
    
    res.status(200).json({
      success: true,
      message: 'Successfully registered for event',
      data: event
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel registration for event
 * @route   DELETE /api/events/:id/register
 * @access  Private
 */
exports.cancelRegistration = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Check if user is registered
    if (!event.isUserRegistered(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You are not registered for this event'
      });
    }
    
    // Remove user from participants
    event.participants = event.participants.filter(
      participant => participant.userId.toString() !== req.user.id.toString()
    );
    
    await event.save();
    
    res.status(200).json({
      success: true,
      message: 'Registration cancelled successfully',
      data: event
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get event participants
 * @route   GET /api/events/:id/participants
 * @access  Private (Event creator or Admin only)
 */
exports.getEventParticipants = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Check if user is authorized to view participants
    // Allow event creator, admin, or registered participants to view
    const isAuthorized = 
      event.createdBy.toString() === req.user.id.toString() ||
      req.user.role === 'admin' || 'organizer' ||
      event.isUserRegistered(req.user.id);
      
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view participants'
      });
    }
    
    res.status(200).json({
      success: true,
      count: event.participants.length,
      data: event.participants
    });
  } catch (error) {
    next(error);
  }
};