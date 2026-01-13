import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const PrivateRoute = () => {
  const { isLoggedIn, loading, user } = useAuth();

  if (loading) {
    console.log('🔄 PrivateRoute: Authentication check in progress...');
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Check authentication - use the correct property from AuthContext
  const hasValidAuth = isLoggedIn;
  
  console.log('🔐 PrivateRoute check:', {
    isLoggedIn,
    hasUser: !!user,
    currentPath: window.location.pathname
  });

  if (!hasValidAuth) {
    console.log('🚫 Access denied - redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  console.log('✅ Access granted - rendering protected route');
  return <Outlet />;
};

export default PrivateRoute;
