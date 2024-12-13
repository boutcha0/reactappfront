import React from 'react';

const Cart = ({ cartItems , deleteFromCart }) => {
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="max-w-5xl mx-auto p-6 absolute z-50 w-full bg-orange-100 right-0">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Shopping Cart</h2>
      
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className="space-y-6">
          {cartItems.map((item) => (
            <li key={item.id} className="flex items-center justify-between space-x-4 border-b pb-6">
              <div className="w-32 h-32 flex-shrink-0">
                <img
                  alt={item.name}
                  src={item.image || '/placeholder.jpg'} // Fallback for missing image
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                  <p className="text-xl font-semibold text-gray-800">${item.price}</p>
                </div>
                <p className="text-sm text-gray-600">Color: {item.color || 'No color specified'}</p>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  <button
                    className="text-red-600 hover:text-red-800 text-sm"
                    onClick={() => deleteFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {cartItems.length > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <p className="text-lg font-semibold text-gray-900">Total Price: ${totalPrice}</p>
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
