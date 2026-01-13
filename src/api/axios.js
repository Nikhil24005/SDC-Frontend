

import axios from 'axios';

// 🌐 Public API instance for unauthenticated requests (registration, public content)
export const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  withCredentials: false, // ✅ Disable cookies for public endpoints to avoid CORS issues
});

// 🔐 Login API instance with credentials for cookie-based authentication
export const loginApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  withCredentials: true, // ✅ Enable cookies for login endpoint
});

// Add request interceptor for debugging public requests
publicApi.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error('❌ Public request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging public responses
publicApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('❌ Public response error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Add request interceptor for debugging login requests
loginApi.interceptors.request.use(
  (config) => {
    console.log('🔐 Making login request to:', config.url);
    return config;
  },
  (error) => {
    console.error('❌ Login request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging login responses
loginApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('❌ Login response error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default publicApi;
