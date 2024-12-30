import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe("pk_test_51QVfcFP5WXi7XkfGk1V7IohDJ1yyojjUVDwjuDra4f2vq7R53LsjMAb1c3yIHcj2ghlhycWjlT41JX7gab2euEwL00jY4szWbn");

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(items);
  }, []);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="bg-white rounded-lg shadow mb-8 p-6">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <img src={item?.image} alt="" width="60" height="60"/>
                  <h3 className="font-medium">{item.name}</h3>
                </div>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="flex justify-between pt-4">
              <span className="text-lg font-bold">Total</span>
              <span className="text-lg font-bold">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <Elements stripe={stripePromise}>
            <PaymentForm total={total} customerId={localStorage.getItem('userId')} />
          </Elements>
        </div>
      </div>
    </div>
  );
};

const PaymentForm = ({ total, customerId }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [fullName, setFullName] = useState('');
    const [orderId, setOrderId] = useState(null);
    const [shippingAddress, setShippingAddress] = useState({
      streetAddress: '', city: '', state: '', postalCode: '', country: ''
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

        // Create a blob from the PDF stream
        const file = new Blob([response.data], { type: 'application/pdf' });
        
        // Create a link element and trigger download
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
      if (!stripe || !elements) return;
  
      setIsProcessing(true);
  
      try {
        for (const [key, value] of Object.entries(shippingAddress)) {
          if (!value.trim()) {
            throw new Error(`Please fill in the ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
          }
        }
        localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
  
        const paymentIntentResponse = await axios.post(
          'http://localhost:8080/api/payments/create-payment-intent',
          { amount: Math.round(total * 100), currency: 'usd' }
        );
  
        const clientSecret = paymentIntentResponse.data;
  
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: { name: fullName }
          }
        });
  
        if (result.error) {
          throw new Error(result.error.message);
        }
  
        if (result.paymentIntent.status === 'succeeded') {
          const cartItems = JSON.parse(localStorage.getItem('cartItems'));
          const orderDTO = {
            infoId: customerId,
            orderItems: cartItems.map(item => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
            shippingAddress,
            totalAmount: total,
            status: "PAID",
          };
  
          const orderResponse = await axios.post('http://localhost:8080/api/orders', orderDTO, {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
          });

          setOrderId(orderResponse.data.id);
          localStorage.removeItem('cartItems');
          localStorage.removeItem('shippingAddress');
          setPaymentStatus('Payment and order successful!');
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