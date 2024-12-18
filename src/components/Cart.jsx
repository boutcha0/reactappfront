import React, { useState, useEffect, useRef } from 'react';
import OrderItem from './Shared/OrderItem';
import StripePayment from './StripePayment';

const Cart = ({ cartItems, deleteFromCart }) => {
  const [productDetails, setProductDetails] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cartRef = useRef(null);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  const totalPrice = cartItems.reduce((total, item) => {
    const productPrice = productDetails.find(product => product.id === item.id)?.price || 0;
    return total + productPrice * item.quantity;
  }, 0);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const responses = await Promise.all(
          cartItems.map(item =>
            fetch(`${API_URL}/api/products/${item.id}`).then(res => {
              if (!res.ok) throw new Error(`Failed to fetch product with ID: ${item.id}`);
              return res.json();
            })
          )
        );
        setProductDetails(responses);
      } catch (err) {
        setError(err.message || 'Error fetching product details.');
        console.error('Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (cartItems.length > 0) {
      fetchProductDetails();
    } else {
      setProductDetails([]);
    }
  }, [cartItems, API_URL]);

  const handleProceedToCheckout = () => setShowPaymentForm(true);

  useEffect(() => {
    const handleClickOutside = event => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const deleteItemFromCart = async (id) => {
    try {
      console.log('Attempting to delete order item with ID:', id); // Debug log
      const response = await fetch(`${API_URL}/api/order-items/by-product/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 404) {
        setError(`Item with ID ${id} was not found in the database`);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete the item from the cart');
      }

      // Successfully deleted - update the UI
      deleteFromCart(id);
    } catch (error) {
      setError(error.message || 'Error removing the item from the cart.');
      console.error('Delete Error:', error);
    }
  };

  return (
    isVisible && (
      <div
        ref={cartRef}
        className="max-w-3xl mx-auto p-6 absolute top-16 right-0 z-20 w-full bg-white rounded-lg shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-95"
      >
        {!showPaymentForm ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h2>
            {loading ? (
              <p>Loading product details...</p>
            ) : error ? (
              <p className="text-red-600">Error: {error}</p>
            ) : cartItems.length === 0 ? (
              <p className="text-lg text-gray-600">Your cart is empty.</p>
            ) : (
              <>
                <ul className="space-y-6">
                  {cartItems.map((item) => {
                    const productDetail = productDetails.find(product => product.id === item.id);
                    return (
                      <OrderItem
                        key={item.id}
                        product={productDetail}
                        quantity={item.quantity}
                        price={productDetail ? productDetail.price : 0}
                        onDelete={() => deleteItemFromCart(item.id)}
                      />
                    );
                  })}
                </ul>
                <div className="mt-8 flex justify-between items-center border-t pt-4">
                  <p className="text-lg font-semibold text-gray-900">
                    Total Price: ${totalPrice.toFixed(2)}
                  </p>
                  <button
                    onClick={handleProceedToCheckout}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-green-700 transition duration-300"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
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