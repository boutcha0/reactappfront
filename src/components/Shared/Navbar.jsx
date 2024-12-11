import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Use useLocation to track current route
import Cart from '../Orders/Cart';


export default function Navbar() {
  const location = useLocation(); // Get current location (URL path)
  const [showComponent, setShowComponent] = useState(false);
  const handleClick = () => {
    setShowComponent(!showComponent);
  };

  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'About', href: '/about', current: location.pathname === '/about' },
    { name: 'Contact', href: '/contact', current: location.pathname === '/contact' },
  ];

  const classNames = (...classes) => classes.filter(Boolean).join(' ');

  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img
              className="h-8 w-auto"
              src="https://as2.ftcdn.net/v2/jpg/05/91/62/89/1000_F_591628903_OCdQi73S1c7MRJIi7vBbTsNYNNrHO0Lw.jpg"
              alt="SkylarkApp"
            />
          </div>

          {/* Navigation Links */}
          <div className="hidden sm:block">
            <div className="flex space-x-4">
              {navigation.map((item) => (
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
              ))}
            </div>
          </div>

          {/* Register, Login Buttons, and Cart Icon */}
          <div className="flex items-center space-x-4">
            {/* Basket Icon (Cart) */}
            <Link
              to="/cart" // Add the cart route here
              className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md p-2"
            >
            </Link>

            {/* Register Button */}
            <Link
              to="/register"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Register
            </Link>
            {/* Login Button */}
            <Link
              to="/login"
              className="rounded-md border border-gray-300 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Login
            </Link>
            <svg onClick={handleClick} className='cursor-pointer' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><title>shopping_cart_1_fill</title><g id="shopping_cart_1_fill" fill='none'><path d='M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z'/><path fill='white' d='M7.5 19a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3m10 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3M3 2c1.726 0 3.023 1.283 3.145 3h13.657a2 2 0 0 1 1.968 2.358l-1.637 9A2 2 0 0 1 18.165 18H6.931a2 2 0 0 1-1.995-1.858l-.8-11.213C4.09 4.31 3.564 4 3 4a1 1 0 0 1 0-2'/></g></svg>
          </div>
        </div>
      </div>
      {showComponent && <Cart />}
    </nav>
    
  );
}
