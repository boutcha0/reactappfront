import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

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
  }, []); 

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
            logout();
          }
        })
        .catch(() => logout());
    }
  }, [validateToken]); 

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
      logout(); 
      return false;
    }
  }, []);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

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
      refreshToken 
    }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  return useContext(AuthContext);
};