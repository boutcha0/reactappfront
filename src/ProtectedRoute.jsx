import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './components/Shared/AuthContext';

// ProtectedRoute component for React Router v6
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect to the login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render the child routes or components if authenticated
  return children ? children : <Outlet />;
};

export default ProtectedRoute;