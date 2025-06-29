const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema({
  maxUsersPerEvent: {
    type: Number,
    default: 100,
    min: 1
  },
  maxEventsPerOrganizer: {
    type: Number,
    default: 10,
    min: 1
  },
  enableRegistration: {
    type: Boolean,
    default: true
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  emailVerificationRequired: {
    type: Boolean,
    default: true
  },
  defaultUserRole: {
    type: String,
    enum: ['participant', 'organizer', 'admin'],
    default: 'participant'
  },
  sessionTimeout: {
    type: Number,
    default: 60, // minutes
    min: 5,
    max: 1440 // 24 hours
  },
  fileUploadLimit: {
    type: Number,
    default: 5, // MB
    min: 1,
    max: 50
  },
  allowedFileTypes: {
    type: String,
    default: '.jpg,.png,.pdf,.doc,.docx'
  },
  systemEmailAddress: {
    type: String,
    default: 'system@univent.com'
  },
  smtpServer: {
    type: String,
    default: 'smtp.univent.com'
  },
  smtpPort: {
    type: Number,
    default: 587
  },
  smtpUsername: {
    type: String,
    default: ''
  },
  smtpPassword: {
    type: String,
    default: '',
    select: false // Don't return password by default in queries
  },
  analyticsEnabled: {
    type: Boolean,
    default: true
  },
  loggingLevel: {
    type: String,
    enum: ['error', 'warn', 'info', 'debug'],
    default: 'info'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: String,
    default: 'system'
  }
});

// Update the updatedAt field on save
systemSettingsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const SystemSettings = mongoose.model('SystemSettings', systemSettingsSchema);

module.exports = SystemSettings;