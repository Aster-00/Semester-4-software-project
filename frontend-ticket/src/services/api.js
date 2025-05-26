import axios from 'axios';

// Create an axios instance with custom config
const api = axios.create({
  baseURL: 'http://localhost:3000/api',// backend server port
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      const token = JSON.parse(user).token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired, etc.)
    if (error.response && error.response.status === 401) {
      // Only clear user info and redirect if the request required authentication
      const publicRoutes = ['/events', '/events/'];
      if (!publicRoutes.includes(error.config.url)) {
        localStorage.removeItem('user');
        // Redirect to login page if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
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
  updateRole: (role) => api.put(`/v1/users/update-role/${role}`),
  logout: () => api.post('/v1/logout'),
  // New MFA endpoints
  verifyMFA: (data) => api.post('/v1/verify-mfa', data),
  resendMFACode: (email) => api.post('/v1/resend-mfa', { email })
};

// Events service endpoints
export const eventService = {
    getAllEvents: () => api.get('/events'),
    getEventById: (id) => api.get(`/v1/events/${id}`),
    createEvent: (eventData) => api.post('/v1/events', eventData, { withCredentials: true }),
    updateEvent: (id, eventData) => api.put(`/v1/events/${id}`, eventData, { withCredentials: true }),
    getApprovedEvents: () => api.get('/v1/events'),
    deleteEvent: (id) => api.delete(`/events/${id}`),
    getUserEvents: () => api.get('/v1/users/events', {
            withCredentials: true
        }),
    getEventsAnalytics: () => api.get('/v1/users/events/analytics', {
            withCredentials: true
        })
};
// Booking service endpoints
export const bookingService = {
  createBooking: async (bookingData) => {
    return await api.post('/v1/bookings', bookingData);
  },
  getUserBookings: async () => {
    return await api.get('/v1/bookings/user');
  },
  getBookingById: async (id) => {
    return await api.get(`/v1/bookings/${id}`);
  },
  cancelBooking: async (bookingId) => {
    console.log('Cancelling booking:', bookingId);
    return await api.put(`/v1/bookings/${bookingId}/cancel`);
  },
  updateBooking: async (bookingId, updateData) => {
    console.log('Updating booking:', bookingId, 'with data:', updateData);
    return await api.put(`/v1/bookings/${bookingId}/update`, updateData);
  }
};

export const admin={
  getUsers:()=> api.get('/v1/users'),
  getEvents:() => api.get('/v1/events/all'),
  approveEvents:(id) => api.patch(`/v1/events/approveevent/${id}`),
  declineEvents:(id) => api.patch(`/v1/events/decline/${id}`),
  updateRole:(id,role) =>api.put(`/v1/users/${id}`,{role}),
  deleteUser:(id) => api.delete(`/v1/users/${id}`)
}

export const profileService={
  viewprofile:()=> api.get('/v1/users/profile'),
  editProfile:(dataToSend)=> api.put('/v1/users/profile',dataToSend)
};

export default api;


