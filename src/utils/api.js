import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach bearer token to outgoing requests
api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user && user.token) {
          config.headers['Authorization'] = `Bearer ${user.token}`;
        }
      } catch (error) {
        console.error('Error reading token from localStorage', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle session expiration (unauthorized errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the error response status is 401, redirect to login or clear credentials
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user');
      // Prevent infinite redirect loops if we are already on login page
      if (!window.location.pathname.includes('/auth/login') && !window.location.pathname.includes('/auth/register')) {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
