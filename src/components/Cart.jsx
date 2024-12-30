import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';


const Cart = ({ isVisible, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [orderProcessing] = useState(false);
  const navigate = useNavigate();
  
  const API_URL = 'http://localhost:8080';

  const fetchProductDetails = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/api/products/${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  };

  const loadCartItems = useCallback(async () => {
    try {
      setLoading(true);
      const storedItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      
      const itemsWithDetails = await Promise.all(
        storedItems.map(async (item) => {
          try {
            const productDetails = await fetchProductDetails(item.id);
            return {
              ...productDetails,
              quantity: item.quantity
            };
          } catch (error) {
            console.error(`Failed to fetch details for product ${item.id}:`, error);
            return item;
          }
        })
      );

      setCartItems(itemsWithDetails);
      calculateTotal(itemsWithDetails);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      loadCartItems();
    }
  }, [isVisible, loadCartItems]);

  const calculateTotal = (items) => {
    const newTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  };

  const updateQuantity = async (productId, change) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    const storageItems = updatedItems.map(({ id, quantity }) => ({ id, quantity }));
    localStorage.setItem('cartItems', JSON.stringify(storageItems));

    setCartItems(updatedItems);
    calculateTotal(updatedItems);
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const removeItem = async (productId) => {
    const updatedItems = cartItems.filter(item => item.id !== productId);
    
    const storageItems = updatedItems.map(({ id, quantity }) => ({ id, quantity }));
    localStorage.setItem('cartItems', JSON.stringify(storageItems));

    setCartItems(updatedItems);
    calculateTotal(updatedItems);
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const handleCheckout = async () => {
    
    navigate('/checkout');
  };
  
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md">
        <div className="flex h-full flex-col bg-white shadow-xl">
          {/* Cart Header */}
          <div className="flex items-center justify-between px-4 py-6 bg-gray-900">
            <div className="flex items-center space-x-2">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h2 className="text-lg font-medium">Shopping Cart</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            {loading ? (
              <div className="text-center py-8">
                <p>Loading cart items...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <p>{error}</p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 bg-white p-4 rounded-lg border">
                    <img
                      src={item.image || '/placeholder.jpg'}
                      alt={item.name}
                      className="h-20 w-20 object-cover rounded"
                      onError={(e) => { e.target.src = '/placeholder.jpg' }}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        ${item.price} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          <div className="border-t border-gray-200 px-4 py-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Total</p>
              <p>${total.toFixed(2)}</p>
            </div>
            <button
              onClick={handleCheckout}
              disabled={cartItems.length === 0 || loading || orderProcessing}
              className="mt-6 w-full rounded-md bg-black py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {orderProcessing ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;