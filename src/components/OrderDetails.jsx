import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
                const response = await fetch(`http://localhost:8080/api/orders/${orderId}`);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setOrder(data);
            } catch (error) {
                setError(error.message);
                console.error('Error fetching order details:', error);
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
                <p className="text-lg">Loading order details...</p>
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