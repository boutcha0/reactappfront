import { useState } from 'react';

const OrderItem = ({ id, product, quantity, price, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      console.log('Deleting order item:', id); // Debug log
      await onDelete(); // Call onDelete passed from Cart component
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center py-4 border-b">
        <div className="flex items-center space-x-4">
          <img
            src={product?.image}
            alt={product?.name}
            className="w-16 h-16 object-cover rounded-md"
          />
          <div>
            <h3 className="text-lg font-semibold">{product?.name}</h3>
            <p className="text-sm text-gray-500">Item ID: {id}</p>
            <p className="text-sm text-gray-500">Quantity: {quantity}</p>
            <p className="text-sm text-gray-500">Price: ${price.toFixed(2)*quantity}</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`${
            isDeleting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700'
          } text-white px-4 py-2 rounded-lg transition duration-300`}
        >
          {isDeleting ? 'Removing...' : 'Remove'}
        </button>
      </div>
      {error && (
        <div className="mt-2 text-red-600 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default OrderItem;
