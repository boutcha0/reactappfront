import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/Shared/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,  
          password 
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Store user data
        localStorage.setItem('userEmail', email);
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userId', data.userId);
        
        // Call login from AuthContext
        await login(data.token, {
          email: email,
          id: data.userId
        });
        
        // Check if there's a redirect path from protected route
        const redirectTo = location.state?.from?.pathname || '/';
        
        // Check if user was trying to checkout
        const checkoutAfterLogin = localStorage.getItem('checkoutAfterLogin');
        if (checkoutAfterLogin) {
          localStorage.removeItem('checkoutAfterLogin');
          navigate('/checkout');
        } else {
          navigate(redirectTo);
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-100 to-gray-300 flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-100">
      <div className="bg-white p-8 rounded-md shadow-lg w-full sm:w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-700">Login to Skylark</h2>
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600 disabled:bg-gray-100"
              placeholder="Enter your Email"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600 disabled:bg-gray-100"
              placeholder="Enter your Password"
            />
          </div>

          <div className="flex justify-between items-center mb-4">
            <Link 
              to="/register" 
              className="text-sm text-yellow-800 hover:text-yellow-900 hover:underline"
              tabIndex={isLoading ? -1 : 0}
            >
              Create an account
            </Link>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-800 text-white py-2 rounded-md hover:bg-yellow-900 transition duration-300 disabled:bg-yellow-600 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;