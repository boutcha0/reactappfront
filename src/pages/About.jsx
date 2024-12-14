import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-out">
        {/* Header Section */}
        <div className="bg-yellow-800 text-white p-8 text-center rounded-t-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4 transform hover:scale-105 transition-all duration-300 ease-out">
            Skylark E-Commerce Platform
          </h1>
          <p className="text-xl text-yellow-200">Your Ultimate Online Shopping Destination</p>
        </div>

        {/* Main Content */}
        <div className="p-8 space-y-6">
          {/* Application Overview */}
          <section>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4 border-b-4 border-yellow-600 pb-2">
              Our Application
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Skylark is a modern, user-friendly e-commerce platform designed to provide seamless shopping experiences.
              Our application offers a clean, intuitive interface that allows users to browse products, manage their cart,
              and interact with our store with ease.
            </p>
          </section>

          {/* Key Features */}
          <section>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4 border-b-4 border-yellow-600 pb-2">
              Key Features
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-orange-50 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-800 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Easy Shopping</h3>
                <p className="text-gray-600">Browse and add products to your cart with just a few clicks.</p>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-800 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Simple Authentication</h3>
                <p className="text-gray-600">Easy login and registration process with email.</p>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-800 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-2v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Cart Management</h3>
                <p className="text-gray-600">Easily manage your cart, view items, and remove products.</p>
              </div>
            </div>
          </section>

          {/* Technologies */}
          <section>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4 border-b-4 border-yellow-600 pb-2">
              Technologies Used
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-out">React</span>
              <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-out">React Router</span>
              <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-out">Tailwind CSS</span>
              <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-out">Axios</span>
              <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-out">SpringBoot</span>

            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center mt-8">
            <Link 
              to="/login"
              className="inline-block bg-yellow-800 text-white px-8 py-3 rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out hover:bg-yellow-900"
            >
              Start Shopping Now
            </Link>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-yellow-800 text-white p-4 text-center">
          <p>&copy; 2024 Skylark E-Commerce. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
