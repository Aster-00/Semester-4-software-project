import axios from 'axios';

// Create an axios instance with custom config
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired, etc.)
    if (error.response && error.response.status === 401) {
      // Clear user info from localStorage
      localStorage.removeItem('user');

      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth service endpoints
export const authService = {
  login: (credentials) => api.post('/v1/login', credentials),
  register: (userData) => api.post('/v1/register', userData),
  viewprofile: () => api.get('/v1/users/profile'),
  requestPasswordReset: (email) => api.post('/v1/request-password-reset', { email }),
  resetPassword: (data) => api.put('/v1/forgot-password', data),
  updateRole: (role) => api.put(`/v1/users/update-role/${role}`)
};

// Events service endpoints
export const eventService = {
  getAllEvents: () => api.get('/events'),
  getEventById: (id) => api.get(`/events/${id}`),
  createEvent: (eventData) => api.post('/events', eventData),
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/events/${id}`)
};

export const profileService = {
  viewprofile: () => api.get('v1/users/profile'),
  editProfile: (dataToSend) => api.put('v1/users/profile', dataToSend)
}

export default api;