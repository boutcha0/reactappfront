import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cart from '../Cart';
import { useAuth } from './AuthContext';

export default function Navbar({ onContactClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showCart, setShowCart] = useState(false);
  const [cartCount, setCartCount] = useState(null);
  const { logout } = useAuth();

  const hiddenRoutes = ['/login', '/register'];
  const shouldHideNavbar = hiddenRoutes.includes(location.pathname);

  useEffect(() => {
    const updateCartCount = (event) => {
      const items = event?.detail?.items || JSON.parse(localStorage.getItem('cartItems') || '[]');
      const uniqueItemCount = items.length;
      setCartCount(uniqueItemCount > 0 ? uniqueItemCount : null);
    };
    
    updateCartCount();
    window.addEventListener('cartUpdate', updateCartCount);
    return () => window.removeEventListener('cartUpdate', updateCartCount);
  }, []);

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
          console.warn('Backend logout failed, proceeding with local logout');
        }
      }

      localStorage.removeItem('cartItems');
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      logout();
      navigate('/login');
    }
  };

  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'About', href: '/about', current: location.pathname === '/about' },
    { name: 'Contact', onClick: onContactClick, current: false },
  ];

  const classNames = (...classes) => classes.filter(Boolean).join(' ');

  if (shouldHideNavbar) return null;

  return (
    <nav className="bg-black text-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/">
              <img
                className="h-16 w-16"
                src="https://yt3.ggpht.com/a/AATXAJw4KRBkKXAdfcyxff_JqzaYD57r_doVzlKsnA=s900-c-k-c0xffffffff-no-rj-mo"
                alt="SkylarkApp"
              />
            </Link>
          </div>

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
                    className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                  >
                    {item.name}
                  </button>
                )
              ))}

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Orders Icon */}
            <button
              onClick={() => navigate('/orders')}
              className="relative p-2 text-gray-300 hover:text-white"
              aria-label="View Orders"
            >
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative p-2 text-gray-300 hover:text-white"
            >
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
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
              {cartCount !== null && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <Cart isVisible={showCart} onClose={() => setShowCart(false)} />
    </nav>
  );
}