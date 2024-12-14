import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

// Create a context for auth
const AuthContext = createContext();

// AuthProvider component to wrap your app and provide context values
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Memoize validateToken using useCallback to resolve dependency warning
  const validateToken = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      logout();
      return false;
    }
  
    try {
      const response = await fetch('http://localhost:8080/api/auth/validate', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        logout();
        return false;
      }
  
      return true;
    } catch (error) {
      logout();
      return false;
    }
  }, []); // Empty dependency array as the function doesn't depend on external state

  // Remove the eslint-disable-next-line and add validateToken to dependency array
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userEmail = localStorage.getItem('userEmail');

    if (token) {
      // Validate token with backend
      validateToken()
        .then(isValid => {
          if (isValid) {
            setIsAuthenticated(true);
            setUser({ email: userEmail });
          } else {
            // Token is invalid, logout
            logout();
          }
        })
        .catch(() => logout());
    }
  }, [validateToken]); // Add validateToken as a dependency

  // Memoize refreshToken using useCallback
  const refreshToken = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.post('http://localhost:8080/api/auth/refresh', 
        {}, 
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        return true;
      }
      return false;
    } catch (error) {
      logout(); // Logout if refresh fails
      return false;
    }
  }, []);

  // Login method to update authentication state
  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  // Logout method to clear authentication state
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout,
      validateToken,
      refreshToken // Keeping refreshToken in the context if needed
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};