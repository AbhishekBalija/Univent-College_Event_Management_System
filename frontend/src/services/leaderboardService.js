import axios from 'axios';

// Base URL for leaderboard service
const API_URL = 'http://localhost:8004/api/leaderboard';

// Create axios instance with default config
const leaderboardApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
leaderboardApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Leaderboard service functions
const leaderboardService = {
  // Get leaderboard for a specific event
  getEventLeaderboard: async (eventId) => {
    try {
      const response = await leaderboardApi.get(`/event/${eventId}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch leaderboard');
    }
  },

  // Get participant's score for a specific event
  getParticipantScore: async (eventId, userId) => {
    try {
      const response = await leaderboardApi.get(`/event/${eventId}/user/${userId}`);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch participant score');
    }
  },

  // Update participant's score (organizers/admins only)
  updateParticipantScore: async (eventId, userId, scoreData) => {
    try {
      const response = await leaderboardApi.put(`/event/${eventId}/user/${userId}`, scoreData);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update score');
    }
  },

  // Get top performers across all events
  getTopPerformers: async () => {
    try {
      const response = await leaderboardApi.get('/top');
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch top performers');
    }
  },

  // Get college leaderboard
  getCollegeLeaderboard: async () => {
    try {
      const response = await leaderboardApi.get('/colleges');
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch college leaderboard');
    }
  }
};

export default leaderboardService;