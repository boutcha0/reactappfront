import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cart from '../Cart';
import { useAuth } from './AuthContext';

export default function Navbar({ cart, deleteFromCart, onContactClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showComponent, setShowComponent] = useState(false);
  const { logout } = useAuth(); // Use the logout method from AuthContext

  // Define routes where Navbar should not be shown
  const hiddenRoutes = ['/login', '/register'];

  // Check if current route should hide the Navbar
  const shouldHideNavbar = hiddenRoutes.includes(location.pathname);

  const handleClick = () => {
    setShowComponent(!showComponent); // Toggle the visibility of the Cart component
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        const response = await fetch('http://localhost:8080/api/auth/logout', { 
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }); 
        
        if (!response.ok) {
          console.warn('Backend logout failed, but proceeding with local logout');
        }
      }

      // Always perform local logout, regardless of backend response
      logout(); 
      navigate('/login');
    } catch (error) {
      console.error('Logout process encountered an error:', error);
      logout(); // Fallback local logout
      navigate('/login');
    }
  };

  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'About', href: '/about', current: location.pathname === '/about' },
    { name: 'Contact', onClick: onContactClick, current: false },
  ];

  const classNames = (...classes) => classes.filter(Boolean).join(' ');

  // If on login or register page, return null to hide the Navbar
  if (shouldHideNavbar) {
    return null;
  }

  return (
    <nav className="bg-black text-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img
              className="h-16 w-16"
              src="https://img.freepik.com/premium-vector/clothing-shop-logo-design-apparel-store-sign_500223-500.jpg?w=360"
              alt="SkylarkApp"
            />
          </div>

          {/* Navigation Links */}
          <div className="hidden sm:block">
            <div className="flex space-x-4">
              {navigation.map((item) => (
                item.href ? (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      item.current
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'rounded-md px-3 py-2 text-sm font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <button
                    key={item.name}
                    onClick={item.onClick}
                    className={classNames(
                      'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'rounded-md px-3 py-2 text-sm font-medium'
                    )}
                  >
                    {item.name}
                  </button>
                )
              ))}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Buttons and Cart Icon */}
          <div className="flex items-center space-x-4">
            {/* Basket Icon (Cart) */}
            <svg
              onClick={handleClick}
              className="cursor-pointer text-gray-300 hover:text-white"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <title>Shopping Cart</title>
              <g fill="none">
                <path
                  fill="currentColor"
                  d="M7.5 19a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3m10 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3M3 2c1.726 0 3.023 1.283 3.145 3h13.657a2 2 0 0 1 1.968 2.358l-1.637 9A2 2 0 0 1 18.165 18H6.931a2 2 0 0 1-1.995-1.858l-.8-11.213C4.09 4.31 3.564 4 3 4a1 1 0 0 1 0-2"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Conditionally Render Cart Component */}
      {showComponent && <Cart cartItems={cart} deleteFromCart={deleteFromCart} />}
    </nav>
  );
}
