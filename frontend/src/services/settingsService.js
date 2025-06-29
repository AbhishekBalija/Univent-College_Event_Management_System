import axios from 'axios';

// Base URL for settings service through the API gateway
const API_URL = 'https://univent-settings-service.onrender.com/api/settings';

// Create axios instance with default config
const settingsApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
settingsApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Get user settings
 * @returns {Promise} Promise with user settings data
 */
const getUserSettings = async () => {
  try {
    const response = await settingsApi.get('/user');
    return response.data;
  } catch (error) {
    console.error('Error fetching user settings:', error);
    throw error;
  }
};

/**
 * Update user settings
 * @param {Object} settings - User settings object
 * @returns {Promise} Promise with updated settings data
 */
const updateUserSettings = async (settings) => {
  try {
    const response = await settingsApi.put('/user', settings);
    return response.data;
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
};

/**
 * Get system settings (admin only)
 * @returns {Promise} Promise with system settings data
 */
const getSystemSettings = async () => {
  try {
    const response = await settingsApi.get('/system');
    return response.data;
  } catch (error) {
    console.error('Error fetching system settings:', error);
    throw error;
  }
};

/**
 * Update system settings (admin only)
 * @param {Object} settings - System settings object
 * @returns {Promise} Promise with updated system settings data
 */
const updateSystemSettings = async (settings) => {
  try {
    const response = await settingsApi.put('/system', settings);
    return response.data;
  } catch (error) {
    console.error('Error updating system settings:', error);
    throw error;
  }
};

const settingsService = {
  getUserSettings,
  updateUserSettings,
  getSystemSettings,
  updateSystemSettings
};

export default settingsService;