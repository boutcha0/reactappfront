import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import OrderNotFound from './OrderNotFound';
import NotFound from './NotFound';

const OrderDetails = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloadingInvoice, setDownloadingInvoice] = useState(false);
    const { orderId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                if (!orderId.match(/^\d+$/)) {
                    setError('invalid_id');
                    return;
                }

                const response = await axios.get(`http://localhost:8080/api/orders/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                
                setOrder(response.data);
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 404) {
                        setError('not_found');
                    } else if (error.response.status === 401 || error.response.status === 403) {
                        setError('unauthorized');
                    }
                } else {
                    setError('network_error');
                    console.error('Error fetching order details:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    const handleDownloadInvoice = async () => {
        try {
            setDownloadingInvoice(true);
            const response = await axios.post(
                `http://localhost:8080/api/payments/generate-invoice/${orderId}`,
                {},
                {
                    headers: { 
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                    responseType: 'blob'
                }
            );

            const file = new Blob([response.data], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            const link = document.createElement('a');
            link.href = fileURL;
            link.download = `invoice-${orderId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(fileURL);
        } catch (error) {
            console.error('Error downloading invoice:', error);
            alert('Error downloading invoice. Please try again.');
        } finally {
            setDownloadingInvoice(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-yellow-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error === 'not_found') {
        return <OrderNotFound orderId={orderId} />;
    }

    if (error === 'invalid_id' || error === 'unauthorized') {
        return <NotFound />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 mb-4 text-gray-600 hover:text-gray-900"
                >
                    <svg 
                        className="w-4 h-4" 
                        fill="none" 
                        strokeWidth="2" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    <span>Back to Orders</span>
                </button>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center pb-4 border-b">
                                <div>
                                    <p className="text-sm text-gray-600">Order Date</p>
                                    <p className="font-medium">
                                        {new Date(order?.orderDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full ${
                                    order?.status === 'PAID' 
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {order?.status}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-medium">Order Items</h3>
                                {order?.orderItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between items-center p-4 border rounded-lg"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src={item.productImage}
                                                alt={item.productName}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <div>
                                                <p className="font-medium">{item.productName}</p>
                                                <p className="text-sm text-gray-600">
                                                    Quantity: {item.quantity} × ${item.unitPrice.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="font-bold">${item.totalAmount.toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            {order?.shippingAddress && (
                                <div className="space-y-2">
                                    <h3 className="font-medium">Shipping Address</h3>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p>{order.shippingAddress.streetAddress}</p>
                                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                                        <p>{order.shippingAddress.country}</p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="flex justify-between items-center pt-4 border-t">
                                    <span className="text-lg font-bold">Total</span>
                                    <span className="text-lg font-bold">${order?.totalAmount.toFixed(2)}</span>
                                </div>
                                
                                <button
                                    onClick={handleDownloadInvoice}
                                    disabled={downloadingInvoice}
                                    className="w-full bg-yellow-900 text-white py-2 px-4 rounded-md hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {downloadingInvoice ? 'Downloading...' : 'Download Invoice'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;