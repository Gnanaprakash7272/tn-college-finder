import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
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

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints for colleges
export const collegeAPI = {
  // Get all colleges with filters
  getColleges: (params = {}) => api.get('/colleges', { params }),
  
  // Get top colleges by NIRF ranking
  getTopColleges: (limit = 10) => api.get('/colleges/top', { params: { limit } }),
  
  // Get colleges by district
  getCollegesByDistrict: (district, type) => 
    api.get(`/colleges/district/${district}`, { params: { type } }),
  
  // Get colleges by type
  getCollegesByType: (type, district) => 
    api.get(`/colleges/type/${type}`, { params: { district } }),
  
  // Search colleges
  searchColleges: (query, limit = 10) => 
    api.get('/colleges/search', { params: { q: query, limit } }),
  
  // Get college by ID
  getCollegeById: (id) => api.get(`/colleges/${id}`),
  
  // Get college courses
  getCollegeCourses: (id) => api.get(`/colleges/${id}/courses`),
  
  // Get college cutoffs
  getCollegeCutoffs: (id, params = {}) => api.get(`/colleges/${id}/cutoffs`, { params }),
  
  // Get college placements
  getCollegePlacements: (id, params = {}) => api.get(`/colleges/${id}/placements`, { params }),
  
  // Get college statistics
  getCollegeStatistics: (id) => api.get(`/colleges/${id}/statistics`),
  
  // Create college (admin)
  createCollege: (data) => api.post('/colleges', data),
  
  // Update college (admin)
  updateCollege: (id, data) => api.put(`/colleges/${id}`, data),
  
  // Delete college (admin)
  deleteCollege: (id) => api.delete(`/colleges/${id}`),
};

// API endpoints for courses
export const courseAPI = {
  // Get all courses
  getCourses: (params = {}) => api.get('/courses', { params }),
  
  // Get course by ID
  getCourseById: (id) => api.get(`/courses/${id}`),
  
  // Get courses by college
  getCoursesByCollege: (collegeId) => api.get(`/courses/college/${collegeId}`),
  
  // Find courses by course code
  getCoursesByCode: (courseCode) => api.get(`/courses/code/${courseCode}`),
  
  // Get courses by fee range
  getCoursesByFeeRange: (minFee, maxFee, category) => 
    api.get('/courses/fee-range', { params: { minFee, maxFee, category } }),
  
  // Get NBA accredited courses
  getNBAAccreditedCourses: () => api.get('/courses/nba-accredited'),
  
  // Create course (admin)
  createCourse: (data) => api.post('/courses', data),
  
  // Update course (admin)
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  
  // Delete course (admin)
  deleteCourse: (id) => api.delete(`/courses/${id}`),
};

// API endpoints for cutoffs
export const cutoffAPI = {
  // Get cutoffs with filters
  getCutoffs: (params = {}) => api.get('/cutoffs', { params }),
  
  // Get cutoff by ID
  getCutoffById: (id) => api.get(`/cutoffs/${id}`),
  
  // Get latest cutoff for college and course
  getLatestCutoff: (collegeId, courseId, community) => 
    api.get('/cutoffs/latest', { params: { collegeId, courseId, community } }),
  
  // Get cutoffs by year and community
  getCutoffsByYearAndCommunity: (year, community, limit = 50) => 
    api.get('/cutoffs/year-community', { params: { year, community, limit } }),
  
  // Get historical cutoffs for prediction
  getHistoricalCutoffs: (collegeId, courseId, years = 5) => 
    api.get('/cutoffs/historical', { params: { collegeId, courseId, years } }),
  
  // Get cutoff trends
  getCutoffTrends: (collegeId, courseId, community) => 
    api.get('/cutoffs/trends', { params: { collegeId, courseId, community } }),
  
  // Find colleges within cutoff range
  findCollegesWithinCutoff: (mark, community, year) => 
    api.get('/cutoffs/within-range', { params: { mark, community, year } }),
  
  // Create cutoff (admin)
  createCutoff: (data) => api.post('/cutoffs', data),
  
  // Update cutoff (admin)
  updateCutoff: (id, data) => api.put(`/cutoffs/${id}`, data),
  
  // Delete cutoff (admin)
  deleteCutoff: (id) => api.delete(`/cutoffs/${id}`),
};

// API endpoints for placements
export const placementAPI = {
  // Get placements with filters
  getPlacements: (params = {}) => api.get('/placements', { params }),
  
  // Get placement by ID
  getPlacementById: (id) => api.get(`/placements/${id}`),
  
  // Get placements by college
  getPlacementsByCollege: (collegeId, params = {}) => 
    api.get(`/placements/college/${collegeId}`, { params }),
  
  // Get placements by course
  getPlacementsByCourse: (courseId, params = {}) => 
    api.get(`/placements/course/${courseId}`, { params }),
  
  // Get placement statistics
  getPlacementStatistics: (params = {}) => 
    api.get('/placements/statistics', { params }),
  
  // Create placement (admin)
  createPlacement: (data) => api.post('/placements', data),
  
  // Update placement (admin)
  updatePlacement: (id, data) => api.put(`/placements/${id}`, data),
  
  // Delete placement (admin)
  deletePlacement: (id) => api.delete(`/placements/${id}`),
};

// API endpoints for search
export const searchAPI = {
  // Global search
  globalSearch: (query, filters = {}) => 
    api.get('/search', { params: { q: query, ...filters } }),
  
  // Autocomplete suggestions
  getAutocompleteSuggestions: (query, type = 'all') => 
    api.get('/search/autocomplete', { params: { q: query, type } }),
  
  // Advanced search
  advancedSearch: (searchParams) => 
    api.post('/search/advanced', searchParams),
};

// API endpoints for comparison
export const comparisonAPI = {
  // Compare colleges
  compareColleges: (collegeIds) => 
    api.post('/comparison/colleges', { collegeIds }),
  
  // Compare courses
  compareCourses: (courseIds) => 
    api.post('/comparison/courses', { courseIds }),
  
  // Get comparison suggestions
  getComparisonSuggestions: (collegeId) => 
    api.get(`/comparison/suggestions/${collegeId}`),
};

// API endpoints for notifications
export const notificationAPI = {
  // Get notifications
  getNotifications: (params = {}) => api.get('/notifications', { params }),
  
  // Mark notification as read
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  
  // Subscribe to notifications
  subscribe: (data) => api.post('/notifications/subscribe', data),
  
  // Unsubscribe from notifications
  unsubscribe: (token) => api.post('/notifications/unsubscribe', { token }),
};

// API endpoints for predictions
export const predictionAPI = {
  // Get cutoff predictions
  getCutoffPredictions: (collegeId, courseId, community) => 
    api.get('/predictions/cutoff', { params: { collegeId, courseId, community } }),
  
  // Get placement predictions
  getPlacementPredictions: (collegeId, courseId) => 
    api.get('/predictions/placement', { params: { collegeId, courseId } }),
  
  // Get admission probability
  getAdmissionProbability: (mark, collegeId, courseId, community) => 
    api.get('/predictions/probability', { params: { mark, collegeId, courseId, community } }),
  
  // Get college recommendations
  getCollegeRecommendations: (mark, community, preferences = {}) => 
    api.post('/predictions/recommendations', { mark, community, ...preferences }),
};

// API endpoints for districts
export const districtAPI = {
  // Get all districts
  getDistricts: () => api.get('/districts'),
  
  // Get district by ID
  getDistrictById: (id) => api.get(`/districts/${id}`),
  
  // Get colleges in district
  getCollegesInDistrict: (districtId) => 
    api.get(`/districts/${districtId}/colleges`),
};

// Utility functions
export const utils = {
  // Handle API errors
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data.message || 'Server error',
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        message: 'Network error. Please check your connection.',
        status: 0,
        data: null
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        status: -1,
        data: null
      };
    }
  },

  // Format API response
  formatResponse: (response) => ({
    data: response.data.data || response.data,
    success: response.data.success || true,
    message: response.data.message || '',
    pagination: response.data.pagination || null
  })
};

export default api;
