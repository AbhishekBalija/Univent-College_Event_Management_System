import axios from 'axios';

const API_URL = 'https://eventflow-announcement-backend.vercel.app/api/announcements';

// Create axios instance
const announcementAPI = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to add auth token
announcementAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Get all announcements
 * @param {Object} filters - Optional filters (eventId, priority, isPublished)
 * @returns {Promise} - Promise with announcements data
 */
const getAllAnnouncements = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    // Add filters to query params if they exist
    if (filters.eventId) params.append('eventId', filters.eventId);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.isPublished !== undefined) params.append('isPublished', filters.isPublished);
    
    const response = await announcementAPI.get('/', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get announcement by ID
 * @param {string} id - Announcement ID
 * @returns {Promise} - Promise with announcement data
 */
const getAnnouncementById = async (id) => {
  try {
    const response = await announcementAPI.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get announcements for a specific event
 * @param {string} eventId - Event ID
 * @returns {Promise} - Promise with announcements data
 */
const getAnnouncementsByEvent = async (eventId) => {
  try {
    const response = await announcementAPI.get(`/event/${eventId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Create a new announcement
 * @param {Object} announcementData - Announcement data
 * @returns {Promise} - Promise with created announcement data
 */
const createAnnouncement = async (announcementData) => {
  try {
    const response = await announcementAPI.post('/', announcementData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Update an announcement
 * @param {string} id - Announcement ID
 * @param {Object} announcementData - Updated announcement data
 * @returns {Promise} - Promise with updated announcement data
 */
const updateAnnouncement = async (id, announcementData) => {
  try {
    const response = await announcementAPI.put(`/${id}`, announcementData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Delete an announcement
 * @param {string} id - Announcement ID
 * @returns {Promise} - Promise with deletion status
 */
const deleteAnnouncement = async (id) => {
  try {
    const response = await announcementAPI.delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const announcementService = {
  getAllAnnouncements,
  getAnnouncementById,
  getAnnouncementsByEvent,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
};

export default announcementService;