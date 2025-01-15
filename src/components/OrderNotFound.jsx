import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderNotFound = ({ orderId }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 mb-4 text-gray-600 hover:text-gray-900"
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            strokeWidth="2" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Back to Orders</span>
        </button>

        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the order with ID: {orderId}. Please check if the order ID is correct.
          </p>
          <button
            onClick={() => navigate('/orders')}
            className="bg-yellow-900 text-white py-2 px-6 rounded-md hover:bg-black transition-colors"
          >
            View All Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderNotFound;