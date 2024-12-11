// src/pages/Login.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState(''); // Renamed to username for clarity
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const email = username.includes('@') ? username : `${username}@skylark.ma`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), // Send email to backend
      });

      if (response.ok) {
        // Successful login
        setError('');
        localStorage.setItem('userEmail', email); // Store email in local storage
        navigate('/Home'); // Redirect to Home
      } else {
        // Handle errors from the backend
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
      }
    } catch (err) {
      // Handle network or unexpected errors
      setError('Something went wrong. Please try again later.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-lg w-full sm:w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-700">Login</h2>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Update username on change
              required
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your Email" // Prompt for the username only
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
