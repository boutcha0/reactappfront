import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './components/Shared/AuthContext';
import AuthRequired from './components/Shared/AuthRequired';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-800"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Special handling for checkout path
    if (location.pathname === '/checkout') {
      localStorage.setItem('checkoutAfterLogin', 'true');
    } else {
      localStorage.setItem('redirectAfterLogin', location.pathname);
    }
    return <AuthRequired />;
  }

  return children;
};

export default ProtectedRoute;