const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Event title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Event capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  tags: {
    type: [String],
    default: []
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Event creator is required']
  },
  organizerName: {
    type: String,
    required: [true, 'Organizer name is required']
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    email: String,
    college: String,
    registrationDate: {
      type: Date,
      default: Date.now
    },
    specialRequirements: String
  }],
  image: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
eventSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for checking if event is full
eventSchema.virtual('isFull').get(function() {
  return this.participants.length >= this.capacity;
});

// Virtual for checking if event is past
eventSchema.virtual('isPast').get(function() {
  return new Date(this.date) < new Date();
});

// Method to check if a user is registered for this event
eventSchema.methods.isUserRegistered = function(userId) {
  return this.participants.some(participant => 
    participant.userId.toString() === userId.toString()
  );
};

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;