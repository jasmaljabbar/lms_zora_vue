// src/api/axios.js
import axios from 'axios';
import router from '../router'; // Import the router instance

// Create API instances
const api = axios.create({
  baseURL: 'http://127.0.0.1:8001/', // Main API
});

const accapi = axios.create({
  baseURL: 'http://127.0.0.1:8002/', // Account API
});

// Request interceptor for both APIs
const setupRequestInterceptor = (instance) => {
  instance.interceptors.request.use(
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
};

// Response interceptor for both APIs
const setupResponseInterceptor = (instance) => {
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        console.warn("Token expired or unauthorized access. Redirecting to login.");
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        router.push('/');
      }
      return Promise.reject(error);
    }
  );
};

// Apply interceptors to both API instances
setupRequestInterceptor(api);
setupResponseInterceptor(api);
setupRequestInterceptor(accapi);
setupResponseInterceptor(accapi);

// Export both API instances
export { api, accapi };
export default api; // Default export for backward compatibility