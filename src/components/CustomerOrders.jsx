import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerOrders = ({ customerId }) => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8080/api/orders/info/${customerId}`);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                if (data && Array.isArray(data) && data.length > 0) {
                    setOrders(data);
                } else {
                    setOrders([]);
                }
            } catch (error) {
                setError(error.message);
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [customerId]);

    const handleOrderClick = (orderId) => {
        navigate(`/orders/${orderId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
                <p className="text-lg">Loading orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
                <p className="text-lg text-red-600">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900">Your Orders</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {orders.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No orders available.</p>
                            ) : (
                                orders.map((order) => (
                                    <div
                                        key={order.id}
                                        onClick={() => handleOrderClick(order.id)}
                                        className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                                    >
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-medium">Order {order.id}</span>
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    order.status === 'PAID' 
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                {new Date(order.orderDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className="font-bold">${order.totalAmount.toFixed(2)}</span>
                                            <svg 
                                                className="w-5 h-5 text-gray-400"
                                                fill="none" 
                                                strokeWidth="2" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerOrders;