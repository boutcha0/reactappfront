import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './components/Shared/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-800"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the attempted URL in location state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render either the children or the Outlet depending on what's provided
  return children ? children : <Outlet />;
};

export default ProtectedRoute;