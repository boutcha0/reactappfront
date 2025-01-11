import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const CustomerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [customerId, setCustomerId] = useState(null);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [totalPages, setTotalPages] = useState(0);

    const currentFrontendPage = parseInt(searchParams.get('page') || '1');
    const getBackendPage = (frontendPage) => Math.max(0, parseInt(frontendPage || '1') - 1);

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
    }, [customerId, searchParams]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const backendQuery = {
                ...Object.fromEntries(searchParams.entries()),
                page: getBackendPage(searchParams.get('page'))
            };

            const response = await axios.get(
                `http://localhost:8080/api/orders/info/${customerId}`,
                { params: backendQuery }
            );

            setOrders(response.data.content);
            setTotalPages(response.data.totalPages);

            const maxFrontendPage = response.data.totalPages;
            if (currentFrontendPage > maxFrontendPage) {
                updateSearchParams({ page: maxFrontendPage.toString() });
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch orders');
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateSearchParams = (updates) => {
        const newParams = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                newParams.set(key, value);
            } else {
                newParams.delete(key);
            }
        });
        setSearchParams(newParams);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const newParams = {
            orderId: formData.get('orderId'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            page: '1'
        };

        Object.keys(newParams).forEach(key => 
            !newParams[key] && delete newParams[key]
        );

        setSearchParams(newParams);
    };

    const handleClearFilters = () => {
        setSearchParams({ page: '1' });
    };

    const handlePageChange = (newFrontendPage) => {
        if (newFrontendPage >= 1 && newFrontendPage <= totalPages) {
            updateSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                page: newFrontendPage.toString()
            });
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
                        <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
                    </div>

                    <div className="p-6 border-b border-gray-200">
                        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Order no.
                                </label>
                                <input
                                    type="text"
                                    name="orderId"
                                    defaultValue={searchParams.get('orderId') || ''}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    placeholder="Search by order number"
                                />
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    name="startDate"
                                    defaultValue={searchParams.get('startDate') || ''}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    name="endDate"
                                    defaultValue={searchParams.get('endDate') || ''}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                            </div>
                            <div className="flex items-end gap-2">
                                <button
                                    type="submit"
                                    className="bg-yellow-900 text-white px-6 py-2 rounded-md hover:bg-yellow-800 transition-colors duration-200"
                                >
                                    Search
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClearFilters}
                                    className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors duration-200"
                                >
                                    Clear
                                </button>
                            </div>
                        </form>
                        {error && (
                            <p className="mt-2 text-sm text-red-600">{error}</p>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
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
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                            No orders found
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
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
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button
                                                    onClick={() => navigate(`/orders/${order.id}`)}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
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

                    <div className="flex justify-between items-center p-4 border-t border-gray-200">
                        <button
                            onClick={() => handlePageChange(currentFrontendPage - 1)}
                            disabled={currentFrontendPage === 1}
                            className={`px-4 py-2 border rounded-md ${
                                currentFrontendPage === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-yellow-900 text-white hover:bg-yellow-800'
                            }`}
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-700">
                            Page {currentFrontendPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentFrontendPage + 1)}
                            disabled={currentFrontendPage >= totalPages}
                            className={`px-4 py-2 border rounded-md ${
                                currentFrontendPage >= totalPages
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-yellow-900 text-white hover:bg-yellow-800'
                            }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerOrders;