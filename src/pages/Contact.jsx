import React, { useState, useEffect } from 'react'

export default function Contact({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: ''
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
      // You can add your form submission logic here
      console.log('Form submitted:', formData);
      alert('Message sent successfully!');
      onClose(); // Close the drawer after submission
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  // Handle escape key to close drawer
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
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black opacity-50" 
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-96 bg-orange-100 shadow-xl transform transition-transform duration-300 ease-in-out 
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 relative">
          {/* Close Button */}
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

          <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Us</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="you@skymark.com"
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
        </div>
      </div>
    </div>
  );
}