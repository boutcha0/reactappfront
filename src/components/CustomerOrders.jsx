import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [customerId, setCustomerId] = useState(null);
    const [searchParams, setSearchParams] = useState({
        orderId: '',
        fromDate: '',
        toDate: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const storedCustomerId = localStorage.getItem('userId');
        if (storedCustomerId) {
            setCustomerId(storedCustomerId);
        } else {
            setError('Customer ID not found.');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (customerId) {
            fetchOrders();
        }
    }, [customerId]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/orders/info/${customerId}`);
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data && Array.isArray(data)) {
                // Sort orders by ID in descending order
                const sortedOrders = data.sort((a, b) => b.id - a.id);
                setOrders(sortedOrders);
                setFilteredOrders(sortedOrders);
            } else {
                setOrders([]);
                setFilteredOrders([]);
            }
        } catch (error) {
            setError(error.message);
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        });
    };

    const filterOrders = () => {
        let filtered = [...orders];

        // Filter by order ID if provided
        if (searchParams.orderId) {
            filtered = filtered.filter(order => 
                String(order.id).includes(searchParams.orderId)
            );
        }

        // Filter by from date independently
        if (searchParams.fromDate) {
            const fromDate = new Date(searchParams.fromDate);
            fromDate.setHours(0, 0, 0, 0);
            filtered = filtered.filter(order => {
                const orderDate = new Date(order.orderDate);
                return orderDate >= fromDate;
            });
        }

        // Filter by to date independently
        if (searchParams.toDate) {
            const toDate = new Date(searchParams.toDate);
            toDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter(order => {
                const orderDate = new Date(order.orderDate);
                return orderDate <= toDate;
            });
        }

        setFilteredOrders(filtered);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        filterOrders();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Remove date interdependency
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
        setError(null); // Clear any existing errors
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
                <p className="text-lg">Loading orders...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900">Order history</h2>
                    </div>

                    {/* Search Form */}
                    <div className="p-6 border-b border-gray-200">
                        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Order no.
                                </label>
                                <input
                                    type="text"
                                    name="orderId"
                                    value={searchParams.orderId}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    placeholder="Search by order number"
                                />
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    From
                                </label>
                                <input
                                    type="date"
                                    name="fromDate"
                                    value={searchParams.fromDate}
                                    onChange={handleDateChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 appearance-none"
                                />
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    To
                                </label>
                                <input
                                    type="date"
                                    name="toDate"
                                    value={searchParams.toDate}
                                    onChange={handleDateChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 appearance-none"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="bg-yellow-900 text-white px-6 py-2 rounded-md hover:bg-blue-800"
                                >
                                    Search
                                </button>
                            </div>
                        </form>
                        {error && (
                            <p className="mt-2 text-sm text-red-600">{error}</p>
                        )}
                    </div>

                    {/* Orders Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order no.
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                            No orders available for the selected criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {order.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(order.orderDate)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                €{order.totalAmount.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    order.status === 'PAID' 
                                                        ? 'bg-green-100 text-green-800'
                                                        : order.status === 'PENDING'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                                                <button
                                                    onClick={() => navigate(`/orders/${order.id}`)}
                                                    className="hover:text-blue-800"
                                                >
                                                    View details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerOrders;