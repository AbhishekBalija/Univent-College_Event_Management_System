const mongoose = require('mongoose');

const userSettingsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  notification: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: false
    }
  },
  theme: {
    type: String,
    enum: ['light', 'dark', 'system'],
    default: 'light'
  },
  language: {
    type: String,
    enum: ['english', 'kannada', 'hindi', 'spanish', 'french', 'german', 'chinese'],
    default: 'english'
  },
  privacy: {
    profileVisibility: {
      type: Boolean,
      default: true
    },
    eventParticipation: {
      type: Boolean,
      default: true
    }
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
userSettingsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const UserSettings = mongoose.model('UserSettings', userSettingsSchema);

module.exports = UserSettings;