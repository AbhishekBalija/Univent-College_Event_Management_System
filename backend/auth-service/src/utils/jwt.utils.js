const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for a user
 * @param {Object} user - User object containing id, role, and college
 * @returns {String} JWT token
 */
exports.generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      role: user.role,
      college: user.college
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '1d' }
  );
};

/**
 * Generate refresh token for a user
 * @param {Object} user - User object containing id
 * @returns {String} Refresh token
 */
exports.generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );
};

/**
 * Verify refresh token
 * @param {String} refreshToken - Refresh token to verify
 * @returns {Object} Decoded token payload
 */
exports.verifyRefreshToken = (refreshToken) => {
  return jwt.verify(
    refreshToken, 
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
  );
};