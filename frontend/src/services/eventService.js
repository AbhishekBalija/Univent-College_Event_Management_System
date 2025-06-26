import axios from 'axios';

// Base URL for event service
const API_URL = 'http://localhost:8002/api/events';

// Create axios instance with default config
const eventApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
eventApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Event service functions
const eventService = {
  // Get all events
  getAllEvents: async (filters = {}) => {
    try {
      const response = await eventApi.get('/', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch events');
    }
  },

  // Get event by ID
  getEventById: async (eventId) => {
    // Validate eventId before making API call
    if (!eventId || eventId === 'undefined' || eventId === 'null') {
      throw new Error('Invalid _id: ' + eventId);
    }

    try {
      console.log('Making API call for eventId:', eventId); // Debug log
      const response = await eventApi.get(`/${eventId}`);
      console.log('API response:', response.data); // Debug log
      return response.data.data; // Extract the data from the nested structure
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch event details');
    }
  },

  // Create new event
  createEvent: async (eventData) => {
    try {
      const response = await eventApi.post('/', eventData);
      console.log('Create event API response:', response.data); // Debug log
      return response.data.data || response.data; // Extract the data from the nested structure if it exists
    } catch (error) {
      console.error('Create event API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create event');
    }
  },

  // Update event
  updateEvent: async (eventId, eventData) => {
    if (!eventId || eventId === 'undefined' || eventId === 'null') {
      throw new Error('Invalid event ID for update');
    }

    try {
      const response = await eventApi.put(`/${eventId}`, eventData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update event');
    }
  },

  // Delete event
  deleteEvent: async (eventId) => {
    if (!eventId || eventId === 'undefined' || eventId === 'null') {
      throw new Error('Invalid event ID for deletion');
    }

    try {
      const response = await eventApi.delete(`/${eventId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete event');
    }
  },

  // Register for event
  registerForEvent: async (eventId, registrationData) => {
    if (!eventId || eventId === 'undefined' || eventId === 'null') {
      throw new Error('Invalid event ID for registration');
    }

    try {
      console.log('Registering for event:', eventId, 'with data:', registrationData); // Debug log
      const response = await eventApi.post(`/${eventId}/register`, registrationData);
      console.log('Registration response:', response.data); // Debug log
      return response.data.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error); // Debug log
      throw new Error(error.response?.data?.message || 'Failed to register for event');
    }
  },

  // Cancel registration
  cancelRegistration: async (eventId) => {
    if (!eventId || eventId === 'undefined' || eventId === 'null') {
      throw new Error('Invalid event ID for cancellation');
    }

    try {
      const response = await eventApi.delete(`/${eventId}/register`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to cancel registration');
    }
  },

  // Get registered participants
  getEventParticipants: async (eventId) => {
    if (!eventId || eventId === 'undefined' || eventId === 'null') {
      throw new Error('Invalid event ID for fetching participants');
    }

    try {
      const response = await eventApi.get(`/${eventId}/participants`);
      console.log('Participants API response:', response.data); // Debug log
      return response.data.data || []; // Extract the data from the nested structure
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch participants');
    }
  }
};

export default eventService;