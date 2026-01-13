import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  getAuthToken, 
  isAuthenticated, 
  clearAuthData, 
  getAdminData, 
  debugAuthStatus,
  storeAuthData,
  isSessionExpired,
  getRemainingSessionTime,
  setupSessionMonitoring,
  isSessionExpiringSoon
} from '../utils/cookieAuth';
import { verifyToken, loginAdmin } from '../api/Admin/login';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [sessionWarning, setSessionWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  // Check authentication status
  const checkAuthStatus = useCallback(async (skipServerVerification = false) => {
    try {
      setLoading(true);
      
      // Debug current auth state
      debugAuthStatus();
      
      // Check if session is expired
      if (isSessionExpired()) {
        setIsLoggedIn(false);
        setUser(null);
        setSessionWarning(false);
        clearAuthData();
        setLoading(false);
        setInitialized(true);
        return false;
      }
      
      const hasLocalAuth = isAuthenticated();
      
      if (!hasLocalAuth) {
        setIsLoggedIn(false);
        setUser(null);
        setSessionWarning(false);
        setLoading(false);
        setInitialized(true);
        return false;
      }
      
      
      // Get admin data and set state immediately for better UX
      const adminData = getAdminData();
      setIsLoggedIn(true);
      setUser(adminData || { authenticated: true });
      setRemainingTime(getRemainingSessionTime());
      
      // Only verify with server if not skipping and not on page refresh
      if (!skipServerVerification) {
        console.log('🔍 Verifying token with server...');
        try {
          await verifyToken();
        } catch (verifyError) {
          console.warn('⚠️ Token verification failed:', verifyError.message);
          
          // Only clear auth and redirect if it's a 401/403 error (invalid token)
          if (verifyError.response?.status === 401 || verifyError.response?.status === 403) {
            clearAuthData();
            setIsLoggedIn(false);
            setUser(null);
            setSessionWarning(false);
            
            // Redirect to login if on admin route
            if (window.location.pathname.includes('/admin') && !window.location.pathname.includes('/login')) {
              console.log('🔀 Redirecting to login page');
              window.location.href = '/admin/login';
            }
            return false;
          } else {
            // For network errors, keep the user logged in but show warning
            console.log('🌐 Network error during verification, keeping user logged in');
          }
        }
      }
      
      return true;
      
    } catch (error) {
      console.error('❌ Error checking auth status:', error);
      
      // Don't log out on network errors during page load
      if (!initialized && (error.code === 'NETWORK_ERROR' || error.message.includes('fetch'))) {
        const hasLocalAuth = isAuthenticated();
        if (hasLocalAuth && !isSessionExpired()) {
          const adminData = getAdminData();
          setIsLoggedIn(true);
          setUser(adminData || { authenticated: true });
          setRemainingTime(getRemainingSessionTime());
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setSessionWarning(false);
      }
      
      return false;
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [initialized]);

  // Initialize authentication on app start
  useEffect(() => {
    if (!initialized) {
      // On app initialization, skip server verification to avoid logout on page refresh
      checkAuthStatus(true);
    }
  }, [checkAuthStatus, initialized]);

  // Setup session monitoring
  useEffect(() => {
    const handleSessionExpiringSoon = (minutes) => {
      setSessionWarning(true);
      setRemainingTime(minutes);
    };

    const handleSessionExpired = () => {
      logout();
    };

    // Setup session monitoring
    const cleanup = setupSessionMonitoring(handleSessionExpiringSoon, handleSessionExpired);
    
    // Update remaining time every minute
    const timeUpdateInterval = setInterval(() => {
      if (isLoggedIn && !isSessionExpired()) {
        const remaining = getRemainingSessionTime();
        setRemainingTime(remaining);
        
        if (isSessionExpiringSoon() && !sessionWarning) {
          setSessionWarning(true);
        }
      }
    }, 60 * 1000);

    return () => {
      cleanup();
      clearInterval(timeUpdateInterval);
    };
  }, [isLoggedIn, sessionWarning]);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      const userData = await loginAdmin(email, password);
      
      // Store auth data
      storeAuthData(userData, userData.token);
      
      // Set state
      setIsLoggedIn(true);
      setUser(userData);
      setSessionWarning(false);
      setRemainingTime(60); // 1 hour in minutes
      
      return userData;
    } catch (error) {
      console.error('❌ Login failed:', error);
      setIsLoggedIn(false);
      setUser(null);
      setSessionWarning(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = useCallback(() => {
    clearAuthData();
    setIsLoggedIn(false);
    setUser(null);
    setSessionWarning(false);
    setRemainingTime(0);
    
    // Redirect to login page if on admin route
    if (window.location.pathname.includes('/admin') && !window.location.pathname.includes('/login')) {
      window.location.href = '/admin/login';
    }
  }, []);

  // Dismiss session warning
  const dismissSessionWarning = useCallback(() => {
    setSessionWarning(false);
  }, []);

  // Extend session (refresh)
  const extendSession = useCallback(() => {
    if (isLoggedIn && user) {
      storeAuthData(user, getAuthToken());
      setSessionWarning(false);
      setRemainingTime(60); // Reset to 1 hour
      return true;
    }
    return false;
  }, [isLoggedIn, user]);

  // Manual auth verification (can be called by components)
  const verifyAuth = useCallback(async () => {
    return await checkAuthStatus(false);
  }, [checkAuthStatus]);

  const value = {
    // Auth state
    isLoggedIn,
    user,
    loading,
    initialized,
    
    // Session management
    sessionWarning,
    remainingTime,
    
    // Auth actions
    login,
    logout,
    checkAuthStatus: verifyAuth,
    
    // Session actions
    dismissSessionWarning,
    extendSession,
    
    // Utility functions
    isSessionExpired: () => isSessionExpired(),
    getRemainingTime: () => getRemainingSessionTime()
  };

  // Show loading spinner during initialization
  if (!initialized && loading) {
    return (
      <AuthContext.Provider value={value}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
      
      {/* Session warning modal */}
      {sessionWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Session Expiring Soon
            </h3>
            <p className="text-gray-600 mb-4">
              Your session will expire in {remainingTime} minute{remainingTime !== 1 ? 's' : ''}. 
              Would you like to extend your session?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={logout}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Logout
              </button>
              <button
                onClick={() => {
                  extendSession();
                  dismissSessionWarning();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Extend Session
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
