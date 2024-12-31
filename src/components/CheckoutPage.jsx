import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe("pk_test_51QVfcFP5WXi7XkfGk1V7IohDJ1yyojjUVDwjuDra4f2vq7R53LsjMAb1c3yIHcj2ghlhycWjlT41JX7gab2euEwL00jY4szWbn");

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderSummary, setOrderSummary] = useState(null);

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const storedItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        
        const orderDTO = {
          orderItems: storedItems.map(item => ({
            productId: item.id,
            quantity: item.quantity
          }))
        };

        const orderCalculation = await axios.post(
          'http://localhost:8080/api/orders/calculate',
          orderDTO,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
          }
        );

        setOrderSummary(orderCalculation.data);
        setCartItems(storedItems);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadCartItems();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 py-8 flex justify-center items-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-50 py-8 flex justify-center items-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="bg-white rounded-lg shadow mb-8 p-6">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {orderSummary?.orderItems.map((item) => (
              <div key={item.productId} className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center space-x-4">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity} × ${item.unitPrice?.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${item.totalAmount?.toFixed(2)}</p>
                </div>
              </div>
            ))}
            <div className="flex justify-between pt-4 border-t">
              <span className="text-lg font-bold">Total</span>
              <span className="text-lg font-bold">
                ${orderSummary?.totalAmount?.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <Elements stripe={stripePromise}>
            <PaymentForm 
              customerId={localStorage.getItem('userId')} 
              orderSummary={orderSummary}
              setOrderSummary={setOrderSummary}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
};

const PaymentForm = ({ customerId, orderSummary, setOrderSummary }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [fullName, setFullName] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });
  
  const stripe = useStripe();
  const elements = useElements();

  const handleDownloadInvoice = async () => {
    try {
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !orderSummary) return;

    setIsProcessing(true);

    try {
      for (const [key, value] of Object.entries(shippingAddress)) {
        if (!value.trim()) {
          throw new Error(`Please fill in the ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
        }
      }

      // Create order with PENDING status
      const orderDTO = {
        infoId: customerId,
        orderItems: orderSummary.orderItems,
        shippingAddress,
        status: "PENDING",
        totalAmount: orderSummary.totalAmount
      };

      const orderResponse = await axios.post(
        'http://localhost:8080/api/orders',
        orderDTO,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        }
      );

      const { id: createdOrderId, totalAmount } = orderResponse.data;

      const paymentIntentResponse = await axios.post(
        'http://localhost:8080/api/payments/create-payment-intent',
        { 
          amount: Math.round(totalAmount * 100),
          currency: 'usd',
          orderId: createdOrderId
        }
      );

      const clientSecret = paymentIntentResponse.data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: fullName }
        }
      });

      if (result.error) {
        await axios.put(
          `http://localhost:8080/api/orders/${createdOrderId}`,
          { status: "FAILED" },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
          }
        );
        throw new Error(result.error.message);
      }

      if (result.paymentIntent.status === 'succeeded') {
        await axios.put(
          `http://localhost:8080/api/orders/${createdOrderId}`,
          { status: "PAID" },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
          }
        );

        setOrderId(createdOrderId);
        localStorage.removeItem('cartItems');
        setPaymentStatus('Payment and order successful!');

        await axios.post(
          `http://localhost:8080/api/orders/${createdOrderId}/sync`,
          {},
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
          }
        );
      }
    } catch (error) {
      setPaymentStatus('Error: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-bold">Shipping & Payment Details</h2>
      
      {paymentStatus && (
        <div className="space-y-4">
          <div
            role="alert"
            className={`mb-4 p-3 rounded ${
              paymentStatus.includes('successful') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}
          >
            {paymentStatus}
          </div>
          
          {orderId && (
            <button
              type="button"
              onClick={handleDownloadInvoice}
              className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-black"
            >
              Download Invoice
            </button>
          )}
        </div>
      )}

      <h3 className="text-lg font-bold">Shipping Address</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(shippingAddress).map(([key, value]) => (
          <input
            key={key}
            type="text"
            placeholder={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
            value={value}
            onChange={e => setShippingAddress(prev => ({ ...prev, [key]: e.target.value }))}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        ))}
      </div>

      <h3 className="text-lg font-bold">Payment Details</h3>
      <div className="mb-4">
        <label htmlFor="fullName" className="block text-sm font-medium mb-2">Full Name</label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="card-element" className="block text-sm font-medium mb-2">Card Details</label>
        <div id="card-element">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': { color: '#aab7c4' },
                },
                invalid: { color: '#9e2146' },
              },
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isProcessing || !stripe}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        {isProcessing ? 'Processing...' : 'Save & Pay Now'}
      </button>
    </form>
  );
};

export default CheckoutPage;