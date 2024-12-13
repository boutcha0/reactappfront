import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
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
        navigate('/'); // Redirect to Home page
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="bg-white p-8 rounded-md shadow-lg w-full sm:w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-700">Login to Skylark</h2>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600"
              placeholder="Enter your Email"
            />
          </div>

          <div className="flex justify-between items-center mb-4">
            <Link to={'/register'} className='text-sm underline text-yellow-800'> 
              Sign Up 
            </Link>
          </div>
          
          <button
            type="submit"
            className="w-full bg-yellow-800 text-white py-2 rounded-md hover:bg-yellow-900 transition duration-300"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;