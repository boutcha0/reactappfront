import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cart from '../components/Cart';

const Home = ({ addToCart }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = useMemo(() => process.env.REACT_APP_API_URL || 'http://localhost:8080', []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL]);

  const handleImageError = (e) => {
    e.target.src = '/placeholder.jpg';
  };

  const handleAddToCart = async (product) => {
    try {
      const currentCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const existingItem = currentCart.find(item => item.id === product.id);
      
      let updatedCart;
      if (existingItem) {
        updatedCart = currentCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...currentCart, { ...product, quantity: 1 }];
      }
      
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      window.dispatchEvent(new Event('cartUpdate'));
      toast.success('Added to cart successfully!');
    } catch (err) {
      toast.error('Failed to add item to cart');
      console.error(err);
    }
  };

  return (
    <div className="bg-white">
      <ToastContainer />
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">List of Products</h2>
          <button
            onClick={() => navigate('/orders')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            View Orders
          </button>
        </div>

        {loading && <p>Loading products...</p>}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {!loading && products.length === 0 ? (
            <p>No products available</p>
          ) : (
            products.map((product) => (
              <div key={product.id} className="group relative">
                <img
                  alt={product.name || 'Product Image'}
                  src={product.image || '/placeholder.jpg'}
                  className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                  onError={handleImageError}
                />
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <span className="text-blue-500 hover:underline">{product.name || 'Unnamed Product'}</span>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.color || 'No color specified'}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {product.price ? `$${product.price}` : 'Price not available'}
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-black"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Cart cartItems={products} deleteFromCart={() => {}} />
    </div>
  );
};

export default Home;