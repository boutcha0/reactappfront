import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Contact({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    error: false,
    errorMessage: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/contact', formData);
      setSubmitStatus({ success: true, error: false, errorMessage: '' });
      
      setTimeout(() => {
        setFormData({ email: '', subject: '', message: '' });
        setSubmitStatus({ success: false, error: false, errorMessage: '' });
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({ 
        success: false, 
        error: true, 
        errorMessage: error.response?.data?.message || 'Failed to send message'
      });
    }
  };

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  return (
    <div 
      className={`fixed inset-0 z-50 overflow-hidden ${isOpen ? 'block' : 'hidden'}`}
    >
      <div 
        className="absolute inset-0 bg-black opacity-50" 
        onClick={onClose}
      ></div>

      <div 
        className={`fixed top-0 right-0 h-full w-96 bg-orange-100 shadow-xl transform transition-transform duration-300 ease-in-out 
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>

          {submitStatus.success && (
            <div className="absolute inset-0 flex items-center justify-center bg-green-100 text-green-700 text-center p-6 z-10 animate-fadeIn">
              <div>
                <p className="text-xl font-bold">Message Sent Successfully!</p>
                <p className="mt-2">We'll get back to you soon.</p>
              </div>
            </div>
          )}

          {submitStatus.error && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-100 text-red-700 text-center p-6 z-10 animate-fadeIn">
              <div>
                <p className="text-xl font-bold">Failed to Send Message</p>
                <p className="mt-2">{submitStatus.errorMessage}</p>
                <button 
                  onClick={() => setSubmitStatus({ success: false, error: false, errorMessage: '' })}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {!submitStatus.success && !submitStatus.error && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Us</h2>

              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Email
                </label>
                <input 
                  type="email" 
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label 
                  htmlFor="subject" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Subject
                </label>
                <input 
                  type="text" 
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  placeholder="What can we help you with?"
                />
              </div>

              <div>
                <label 
                  htmlFor="message" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Message
                </label>
                <textarea 
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  placeholder="Share your thoughts..."
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition duration-300"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}