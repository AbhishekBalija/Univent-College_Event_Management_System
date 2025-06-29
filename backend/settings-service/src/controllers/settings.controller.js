const UserSettings = require('../models/UserSettings');
const SystemSettings = require('../models/SystemSettings');

/**
 * @desc    Get user settings
 * @route   GET /api/settings/user
 * @access  Private
 */
exports.getUserSettings = async (req, res, next) => {
  try {
    // Get user ID from authenticated user
    const userId = req.user.id;

    // Find user settings or create default if not exists
    let userSettings = await UserSettings.findOne({ userId });

    if (!userSettings) {
      // Create default settings if not found
      userSettings = await UserSettings.create({ userId });
    }

    res.status(200).json({
      success: true,
      data: userSettings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user settings
 * @route   PUT /api/settings/user
 * @access  Private
 */
exports.updateUserSettings = async (req, res, next) => {
  try {
    // Get user ID from authenticated user
    const userId = req.user.id;

    // Find user settings or create default if not exists
    let userSettings = await UserSettings.findOne({ userId });

    if (!userSettings) {
      // Create with provided settings
      userSettings = await UserSettings.create({
        userId,
        ...req.body
      });
    } else {
      // Update existing settings
      // Only update fields that are provided in the request
      if (req.body.notification) userSettings.notification = req.body.notification;
      if (req.body.theme) userSettings.theme = req.body.theme;
      if (req.body.language) userSettings.language = req.body.language;
      if (req.body.privacy) userSettings.privacy = req.body.privacy;

      await userSettings.save();
    }

    res.status(200).json({
      success: true,
      data: userSettings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get system settings
 * @route   GET /api/settings/system
 * @access  Private (Admin only)
 */
exports.getSystemSettings = async (req, res, next) => {
  try {
    // Find system settings or create default if not exists
    let systemSettings = await SystemSettings.findOne({});

    if (!systemSettings) {
      // Create default settings if not found
      systemSettings = await SystemSettings.create({});
    }

    res.status(200).json({
      success: true,
      data: systemSettings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update system settings
 * @route   PUT /api/settings/system
 * @access  Private (Admin only)
 */
exports.updateSystemSettings = async (req, res, next) => {
  try {
    // Find system settings or create default if not exists
    let systemSettings = await SystemSettings.findOne({});

    if (!systemSettings) {
      // Create with provided settings
      systemSettings = await SystemSettings.create({
        ...req.body,
        updatedBy: req.user.id
      });
    } else {
      // Update existing settings with all fields from request body
      // This allows for partial updates
      Object.keys(req.body).forEach(key => {
        // Skip updatedAt and updatedBy as they are handled separately
        if (key !== 'updatedAt' && key !== 'updatedBy') {
          systemSettings[key] = req.body[key];
        }
      });

      // Set updatedBy to current admin user
      systemSettings.updatedBy = req.user.id;

      await systemSettings.save();
    }

    res.status(200).json({
      success: true,
      data: systemSettings
    });
  } catch (error) {
    next(error);
  }
};