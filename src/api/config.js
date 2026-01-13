import axios from 'axios';
import { clearAuthData } from '../utils/cookieAuth';

// 🔐 Authenticated API instance for admin and protected routes
export const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // ✅ Enables automatic cookie sending (JWT from backend)
});

// Add request interceptor for authenticated requests
authApi.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling authentication errors
authApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    
    // Handle authentication failures for actual data endpoints
    if (status === 401 || status === 403) {
      const isVerificationEndpoint = url?.includes('/auth/verify');
      
      if (!isVerificationEndpoint) {
        clearAuthData();
        
        // Redirect to login page if not already there
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/admin/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Default export is the authenticated API for admin use
export default authApi;
