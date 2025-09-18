// src/api/axios.js
import axios from 'axios';
import router from '../router';

// Create API instances
const api = axios.create({
  baseURL: 'http://127.0.0.1:8001/', // Main API
});

const accapi = axios.create({
  baseURL: 'http://127.0.0.1:8002/', // Account API
});

const coreapi = axios.create({
  baseURL: 'http://127.0.0.1:8000/', // Core API
});

// Request interceptor
const setupRequestInterceptor = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

// Response interceptor with refresh token
const setupResponseInterceptor = (instance) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          try {
            // ✅ FIXED refresh call
            const res = await coreapi.post("/refresh", {
              refresh_token: refreshToken,
            });

            const newAccessToken = res.data.access_token;
            localStorage.setItem('access_token', newAccessToken);

            // Update original request with new token
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return instance(originalRequest);
          } catch (refreshError) {
            console.error('Refresh token failed', refreshError);
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            router.push('/');
          }
        } else {
          router.push('/');
        }
      }

      return Promise.reject(error);
    }
  );
};


export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return null;

  try {
    // ✅ FIXED refresh call
    const res = await coreapi.post("/refresh", {
      refresh_token: refreshToken,
    });

    const newAccessToken = res.data.access_token;
    localStorage.setItem('access_token', newAccessToken);
    return newAccessToken;
  } catch (err) {
    console.error("Refresh token expired or invalid", err);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    return null;
  }
}

// Apply interceptors
[api, accapi, coreapi].forEach((instance) => {
  setupRequestInterceptor(instance);
  setupResponseInterceptor(instance);
});

// Export
export { api, accapi, coreapi };
export default api;
