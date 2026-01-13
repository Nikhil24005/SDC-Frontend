import { authApi } from '../config'; // ✅ Use config.js for authenticated requests
import { loginApi } from '../axios'; // ✅ Use loginApi for login (with credentials)
import { storeAuthData, clearAuthData } from '../../utils/cookieAuth';

export const loginAdmin = async (email, password) => {
  try {
    console.log('🔐 Attempting login for:', email);
    
    const response = await loginApi.post('/auth/login', {
      email,
      password,
    });

    // Handle different success response formats
    const isSuccess = response.data.status === true || 
                      response.data.success === true || 
                      response.data.message === 'Login successfull' ||
                      response.data.message === 'Login successful' ||
                      response.status === 200;

    if (!isSuccess && !response.data.data) {
      throw new Error(response.data.message || 'Login failed');
    }

    // Extract admin data
    const adminData = response.data.data || response.data || { email };
    console.log('✅ Login successful, admin data:', adminData);
    
    // Check if we can find a JWT cookie that was set by the backend
    const allCookies = document.cookie;
    
    // Look for common JWT cookie names that backends use
    const jwtCookieNames = ['jwt', 'token', 'authToken', 'jwtToken', 'access_token', 'auth'];
    let foundJwtCookie = false;
    
    for (const cookieName of jwtCookieNames) {
      if (allCookies.includes(`${cookieName}=`)) {
        console.log(`✅ Found JWT cookie: ${cookieName}`);
        foundJwtCookie = true;
        break;
      }
    }
    
    // Store auth data with 1-hour expiry
    const tokenToStore = foundJwtCookie ? 'backend-cookie-jwt' : 'dev-token-placeholder';
    storeAuthData(adminData, tokenToStore);
    console.log('🍪 Auth data stored with 1-hour session');
    
    return adminData;

  } catch (error) {
    console.error('❌ Login error:', error.message);
    
    if (error.response?.data?.message === 'Login successfull' || 
        error.response?.data?.message === 'Login successful') {
      const adminData = error.response.data.data || error.response.data || { email };
      
      const token = error.response.data.token || 
                    error.response.data.data?.token || 
                    error.response.data.jwt || 
                    error.response.data.data?.jwt ||
                    error.response.data.accessToken ||
                    error.response.data.data?.accessToken;
      
      if (token) {
        storeAuthData(adminData, token);
        return adminData;
      }
    }
    
    const message = error.response?.data?.message || error.message || 'Login failed';
    throw new Error(message);
  }
};


export const verifyToken = async () => {
  try {
    const response = await authApi.get('/auth/verify'); 
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logoutAdmin = async () => {
  try {
    await authApi.post('/auth/logout');
  } catch (err) {
    console.warn('Logout API call failed:', err);
  } finally {
    clearAuthData();
  }
};
