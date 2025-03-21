import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate} from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    adresse: "",
    email: "",
    password: "", 
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.password) {
      setError("Please enter a password");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/auth/register", formData); 
      setMessage("Registration successful!");
      setError(""); 
      setFormData({ name: "", adresse: "", email: "", password: "" }); 
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during registration.");
      setMessage("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Register for Dickies Store</h2>

        {message && <p className="mb-4 text-green-500 text-center">{message}</p>}
        {error && <p className="mb-4 text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600"
              required
            />
          </div>

          <div>
            <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              name="adresse"
              id="adresse"
              value={formData.adresse}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 mb-4 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600"
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <Link to={'/login'} className='text-sm underline text-yellow-800'> 
              Already have an account? Sign In 
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-800 text-white py-2 rounded-md hover:bg-yellow-900 transition duration-300 mt-4"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
