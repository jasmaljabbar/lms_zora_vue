// src/api/axios.js
import axios from 'axios';
import router from '../router'; // Import the router instance

const api = axios.create({
  baseURL: 'http://127.0.0.1:8001/', // Ensure this matches your FastAPI backend base URL
});

// Request interceptor: Attach token before sending request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle token expiration and other errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if the error is due to an expired token or authentication failure
    if (error.response && error.response.status === 401) {
      console.warn("Token expired or unauthorized access. Redirecting to login.");
      // Clear token and user data
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      // Redirect to login page
      router.push('/');
      // Optionally, show a message to the user
      // alert('Your session has expired. Please log in again.');
    }
    return Promise.reject(error);
  }
);

export default api;