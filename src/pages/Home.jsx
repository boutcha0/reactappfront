import React, { useState, useEffect } from 'react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the products data from the API
    const fetchProducts = async () => {
      try {
        setLoading(true); // Start loading
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
        const response = await fetch(`${API_URL}/api/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (productId) => {
    console.log(`Product ${productId} added to cart`);
    // Implement add to cart functionality
  };

  const handleBuyNow = (productId) => {
    console.log(`Proceeding to buy product ${productId}`);
    // Implement buy now functionality
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">List of Products</h2>

        {loading && <p>Loading products...</p>}

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {!loading && products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="group relative">
                <img
                  alt={product.name || 'Product Image'}
                  src={product.image || '/placeholder.jpg'} // Fallback for missing image
                  className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                />
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <button
                        onClick={() => handleBuyNow(product.id)}
                        className="text-blue-500 hover:underline"
                      >
                        {product.name || 'Unnamed Product'}
                      </button>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.color || 'No color specified'}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {product.price ? `$${product.price}` : 'Price not available'}
                  </p>
                </div>

                {/* Add to Cart and Buy Now buttons */}
                <div className="mt-4 flex justify-between space-x-2">
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleBuyNow(product.id)}
                    className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            !loading && <p>No products available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
