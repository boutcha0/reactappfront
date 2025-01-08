import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const CustomerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [customerId, setCustomerId] = useState(null);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize search state from URL parameters
    const [searchState, setSearchState] = useState({
        orderId: searchParams.get('orderId') || '',
        startDate: searchParams.get('startDate') || '',
        endDate: searchParams.get('endDate') || ''
    });

    // Initialize pagination state - size is now just a constant
    const size = 10; // Fixed size, not from URL
    const [page, setPage] = useState(parseInt(searchParams.get('page')) || 0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const storedCustomerId = localStorage.getItem('userId');
        if (storedCustomerId) {
            setCustomerId(storedCustomerId);
        } else {
            setError('Customer ID not found.');
            setLoading(false);
        }
    }, []);

    // Update URL when pagination changes - removed size parameter
    useEffect(() => {
        const currentParams = Object.fromEntries(searchParams.entries());
        setSearchParams({
            ...currentParams,
            page: page.toString()
        });
    }, [page]);

    useEffect(() => {
        if (customerId) {
            fetchOrders();
        }
    }, [customerId, searchParams]); 

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const currentPage = searchParams.get('page') || '0';
            
            let url = `http://localhost:8080/api/orders/info/${customerId}?page=${currentPage}&size=${size}`;
            
            // Add search parameters to URL if they exist
            const apiParams = new URLSearchParams();
            const orderId = searchParams.get('orderId');
            const startDate = searchParams.get('startDate');
            const endDate = searchParams.get('endDate');

            if (orderId) apiParams.append('orderId', orderId);
            if (startDate) apiParams.append('startDate', startDate);
            if (endDate) apiParams.append('endDate', endDate);

            if (apiParams.toString()) {
                url += `&${apiParams.toString()}`;
            }

            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const data = await response.json();
            setOrders(data.content);
            setTotalPages(data.totalPages);
            
            // Update page state from response if needed
            const responseCurrentPage = Math.min(parseInt(currentPage), data.totalPages - 1);
            if (responseCurrentPage !== page) {
                setPage(responseCurrentPage);
            }
        } catch (error) {
            setError(error.message);
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        
        // Preserve current pagination while updating search params
        const params = new URLSearchParams(searchParams);
        
        // Reset to first page on new search
        params.set('page', '0');
        
        if (searchState.orderId) params.set('orderId', searchState.orderId);
        if (searchState.startDate) params.set('startDate', searchState.startDate);
        if (searchState.endDate) params.set('endDate', searchState.endDate);
        
        setSearchParams(params);
        setPage(0); // Reset page state
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setSearchState(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClearFilters = () => {
        setSearchState({
            orderId: '',
            startDate: '',
            endDate: ''
        });
        
        // Preserve only page parameter
        setSearchParams({
            page: '0'
        });
        setPage(0);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
            const params = new URLSearchParams(searchParams);
            params.set('page', newPage.toString());
            setSearchParams(params);
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
                                    value={searchState.orderId}
                                    onChange={handleFormChange}
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
                                    value={searchState.startDate}
                                    onChange={handleFormChange}
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
                                    value={searchState.endDate}
                                    onChange={handleFormChange}
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

                    {/* Orders Table */}
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

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center p-4 border-t border-gray-200">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 0}
                            className={`px-4 py-2 border rounded-md ${
                                page === 0 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-yellow-900 text-white hover:bg-yellow-800'
                            }`}
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-700">
                            Page {page + 1} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page >= totalPages - 1}
                            className={`px-4 py-2 border rounded-md ${
                                page >= totalPages - 1
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