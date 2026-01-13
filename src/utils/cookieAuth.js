// Cookie-based authentication utilities with 1-hour session management
import Cookies from 'js-cookie';

// Cookie and storage keys
const AUTH_TOKEN_COOKIE = 'auth_token';
const ADMIN_DATA_COOKIE = 'admin_data';
const LOGIN_TIME_COOKIE = 'login_time';

// LocalStorage keys as fallback
const AUTH_TOKEN_STORAGE = 'sdc_auth_token';
const ADMIN_DATA_STORAGE = 'sdc_admin_data';
const LOGIN_TIME_STORAGE = 'sdc_login_time';

// Session duration: 1 hour
const SESSION_DURATION_HOURS = 1;
const SESSION_DURATION_MS = SESSION_DURATION_HOURS * 60 * 60 * 1000;

// Cookie options for 1-hour session
const cookieOptions = {
  expires: SESSION_DURATION_HOURS / 24, // Convert hours to days for cookie expiry
  path: '/',
  sameSite: 'Lax',
  // Only set secure in production HTTPS
  ...(window.location.protocol === 'https:' && {
    secure: true
  })
};

/**
 * Store authentication data with 1-hour expiration
 */
export const storeAuthData = (adminData, token) => {
  try {
    const loginTime = Date.now();
    const expiryTime = loginTime + SESSION_DURATION_MS;
    
    
    if (token) {
      // Store in both cookie and localStorage
      Cookies.set(AUTH_TOKEN_COOKIE, token, cookieOptions);
      localStorage.setItem(AUTH_TOKEN_STORAGE, token);
    }
    
    if (adminData) {
      const adminDataString = JSON.stringify(adminData);
      Cookies.set(ADMIN_DATA_COOKIE, adminDataString, cookieOptions);
      localStorage.setItem(ADMIN_DATA_STORAGE, adminDataString);
    }
    
    // Store login timestamp
    Cookies.set(LOGIN_TIME_COOKIE, loginTime.toString(), cookieOptions);
    localStorage.setItem(LOGIN_TIME_STORAGE, loginTime.toString());
    
  } catch (error) {
    console.error('❌ Error storing auth data:', error);
  }
};

/**
 * Get authentication token from cookie or localStorage
 */
export const getAuthToken = () => {
  if (isSessionExpired()) {
    clearAuthData();
    return null;
  }
  
  return Cookies.get(AUTH_TOKEN_COOKIE) || localStorage.getItem(AUTH_TOKEN_STORAGE) || null;
};

/**
 * Get admin data from cookie or localStorage
 */
export const getAdminData = () => {
  if (isSessionExpired()) {
    clearAuthData();
    return null;
  }
  
  try {
    const adminDataString = Cookies.get(ADMIN_DATA_COOKIE) || localStorage.getItem(ADMIN_DATA_STORAGE);
    if (adminDataString) {
      return JSON.parse(adminDataString);
    }
  } catch (error) {
    console.error('❌ Error parsing admin data:', error);
  }
  return null;
};

/**
 * Get login timestamp
 */
export const getLoginTime = () => {
  const loginTimeStr = Cookies.get(LOGIN_TIME_COOKIE) || localStorage.getItem(LOGIN_TIME_STORAGE);
  return loginTimeStr ? parseInt(loginTimeStr, 10) : null;
};

/**
 * Check if the session has expired (1 hour)
 */
export const isSessionExpired = () => {
  const loginTime = getLoginTime();
  if (!loginTime) {
    return true; // No login time means no session
  }
  
  const currentTime = Date.now();
  const sessionAge = currentTime - loginTime;
  const isExpired = sessionAge > SESSION_DURATION_MS;
  
 
  
  return isExpired;
};

/**
 * Get remaining session time in minutes
 */
export const getRemainingSessionTime = () => {
  const loginTime = getLoginTime();
  if (!loginTime) return 0;
  
  const currentTime = Date.now();
  const sessionAge = currentTime - loginTime;
  const remainingMs = SESSION_DURATION_MS - sessionAge;
  
  return remainingMs > 0 ? Math.round(remainingMs / (1000 * 60)) : 0;
};

/**
 * Check if user is authenticated and session is valid
 */
export const isAuthenticated = () => {
  if (isSessionExpired()) {
    return false;
  }
  
  const token = Cookies.get(AUTH_TOKEN_COOKIE) || localStorage.getItem(AUTH_TOKEN_STORAGE);
  const adminData = Cookies.get(ADMIN_DATA_COOKIE) || localStorage.getItem(ADMIN_DATA_STORAGE);
  const isAuth = !!(token && adminData);
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🔐 Auth check:', {
      hasToken: !!token,
      hasAdminData: !!adminData,
      isAuthenticated: isAuth,
      sessionExpired: isSessionExpired(),
      remainingMinutes: getRemainingSessionTime()
    });
  }
  
  return isAuth;
};

/**
 * Clear all authentication data
 */
export const clearAuthData = () => {
  
  // Clear cookies
  Cookies.remove(AUTH_TOKEN_COOKIE, { path: '/' });
  Cookies.remove(ADMIN_DATA_COOKIE, { path: '/' });
  Cookies.remove(LOGIN_TIME_COOKIE, { path: '/' });
  
  // Clear localStorage
  localStorage.removeItem(AUTH_TOKEN_STORAGE);
  localStorage.removeItem(ADMIN_DATA_STORAGE);
  localStorage.removeItem(LOGIN_TIME_STORAGE);
  
};

/**
 * Check if session will expire within next 5 minutes
 */
export const isSessionExpiringSoon = () => {
  const remainingMinutes = getRemainingSessionTime();
  return remainingMinutes > 0 && remainingMinutes <= 5;
};

/**
 * Extend session by storing new login time (refresh session)
 */
export const extendSession = () => {
  const token = getAuthToken();
  const adminData = getAdminData();
  
  if (token && adminData && !isSessionExpired()) {
    storeAuthData(adminData, token);
    return true;
  }
  
  return false;
};

/**
 * Debug function to log current auth status
 */
export const debugAuthStatus = () => {
  const token = getAuthToken();
  const adminData = getAdminData();
  const isAuth = isAuthenticated();
  const loginTime = getLoginTime();
  

  
  return { token, adminData, isAuth, loginTime, remainingMinutes: getRemainingSessionTime() };
};

/**
 * Setup session monitoring with warning notifications
 */
export const setupSessionMonitoring = (onSessionExpiringSoon, onSessionExpired) => {
  const checkSession = () => {
    if (isSessionExpired()) {
      onSessionExpired?.();
      return;
    }
    
    if (isSessionExpiringSoon()) {
      onSessionExpiringSoon?.(getRemainingSessionTime());
    }
  };
  
  // Check every minute
  const intervalId = setInterval(checkSession, 60 * 1000);
  
  // Return cleanup function
  return () => clearInterval(intervalId);
};
