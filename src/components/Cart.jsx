import React, { useState, useEffect, useRef } from 'react';
import StripePayment from './StripePayment';

const Cart = ({ cartItems, deleteFromCart }) => {
  const [productDetails, setProductDetails] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // To control cart visibility
  const [loading, setLoading] = useState(false); // Handle loading state when fetching products
  const [error, setError] = useState(null); // Handle errors in product fetching
  const cartRef = useRef(null); // Reference to the cart container
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Fetch product details by ID when the cart items change
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true); // Start loading state
      setError(null); // Reset previous errors
      try {
        const details = await Promise.all(
          cartItems.map(async (item) => {
            const response = await fetch(`${API_URL}/api/products/${item.id}`);
            if (!response.ok) {
              throw new Error(`Failed to fetch product with ID: ${item.id}`);
            }
            const data = await response.json();
            return data;
          })
        );
        setProductDetails(details);
      } catch (error) {
        setError(error.message); // Set the error message
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false); // End loading state
      }
    };

    if (cartItems.length > 0) {
      fetchProductDetails();
    } else {
      setProductDetails([]);  // Clear product details if the cart is empty
    }
  }, [cartItems, API_URL]);

  const handleProceedToCheckout = () => {
    setShowPaymentForm(true);
  };

  // Close the cart if clicked outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsVisible(false); // Hide cart when clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside); // Listen for outside clicks

    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Clean up event listener
    };
  }, []);

  return (
    isVisible && (
      <div
        ref={cartRef} // Set the ref to the cart container
        className="max-w-3xl mx-auto p-6 absolute top-16 right-0 z-20 w-full bg-white rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-95"
      >
        {!showPaymentForm ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h2>

            {cartItems.length === 0 ? (
              <p className="text-lg text-gray-600">Your cart is empty.</p>
            ) : (
              <>
                {loading ? (
                  <p>Loading product details...</p>
                ) : error ? (
                  <p className="text-red-600">Error: {error}</p>
                ) : (
                  <ul className="space-y-6">
                    {productDetails.map((product, index) => (
                      <li
                        key={product.id || index}
                        className="flex items-center justify-between space-x-4 border-b pb-6"
                      >
                        <div className="w-24 h-24 flex-shrink-0">
                          <img
                            alt={product.name}
                            src={product.image || '/placeholder.jpg'}
                            className="w-full h-full object-cover rounded-lg shadow-md"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                            <p className="text-lg font-semibold text-gray-800">${product.price}</p>
                          </div>
                          <p className="text-sm text-gray-600">Color: {product.color || 'No color specified'}</p>
                          <div className="flex justify-between items-center mt-4">
                            <p className="text-sm text-gray-600">Qty: {cartItems[index]?.quantity}</p>
                            <button
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                              onClick={() => deleteFromCart(product.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}

            {cartItems.length > 0 && (
              <div className="mt-8 flex justify-between items-center border-t pt-4">
                <p className="text-lg font-semibold text-gray-900">Total Price: ${totalPrice}</p>
                <button
                  onClick={handleProceedToCheckout}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-green-700 transition duration-300"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </>
        ) : (
          <StripePayment totalPrice={totalPrice} />
        )}
      </div>
    )
  );
};

export default Cart;
