import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AuthRequired = () => {
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const originalRedirect = params.get('redirect') || '/';
  const redirectPath = originalRedirect === '/auth-required' ? '/' : originalRedirect;

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-100 to-gray-300 flex items-center justify-center">
      <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Authentication Required</h2>
        <p className="text-gray-600 mb-6">
          Please log in to view your orders. If you don't have an account, you can create one for free.
        </p>
        <div className="space-y-4">
          <Link
            to={`/login?redirect=${redirectPath}`}
            className="block w-full bg-yellow-800 text-white py-2 px-4 rounded-md hover:bg-yellow-900 transition duration-300"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="block w-full border border-yellow-800 text-yellow-800 py-2 px-4 rounded-md hover:bg-yellow-50 transition duration-300"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthRequired;
