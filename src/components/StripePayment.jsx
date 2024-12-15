import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { 
  Elements, 
  CardElement, 
  useStripe, 
  useElements 
} from "@stripe/react-stripe-js";
import axios from 'axios';

// Load your Stripe publishable key
const stripePromise = loadStripe("pk_test_51QVfcFP5WXi7XkfGk1V7IohDJ1yyojjUVDwjuDra4f2vq7R53LsjMAb1c3yIHcj2ghlhycWjlT41JX7gab2euEwL00jY4szWbn");

const CheckoutForm = ({ totalPrice, customerId }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [invoiceUrl, setInvoiceUrl] = useState(null);
  const [fullName, setFullName] = useState('');

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentStatus(null);
    setInvoiceUrl(null);

    try {
      // 1. Create Payment Intent
      const paymentIntentResponse = await axios.post('http://localhost:8080/api/payments/create-payment-intent', {
        amount: totalPrice,
        currency: 'usd'
      });

      const clientSecret = paymentIntentResponse.data;

      // 2. Confirm Payment
      const cardElement = elements.getElement(CardElement);
      
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: fullName
          }
        }
      });

      if (result.error) {
        setPaymentStatus('Payment failed: ' + result.error.message);
        console.error(result.error);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          // 3. Generate Invoice
          try {
            const invoiceResponse = await axios.post(
              'http://localhost:8080/api/payments/generate-invoice', 
              {
                customerId: customerId, 
                totalPrice: totalPrice
              }, 
              {
                responseType: 'blob'
              }
            );

            const invoiceBlobUrl = window.URL.createObjectURL(new Blob([invoiceResponse.data]));
            
            setPaymentStatus('Payment successful!');
            setInvoiceUrl(invoiceBlobUrl);
          } catch (invoiceError) {
            console.error('Invoice generation failed', invoiceError);
            setPaymentStatus('Payment successful, but invoice generation failed.');
          }
        }
      }
    } catch (error) {
      setPaymentStatus('Payment error: ' + error.message);
      console.error('Payment error', error);
    }

    setIsProcessing(false);
  };

  const handleDownloadInvoice = () => {
    if (invoiceUrl) {
      const link = document.createElement('a');
      link.href = invoiceUrl;
      link.setAttribute('download', `invoice-${customerId}-${new Date().toISOString()}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Payment Details</h2>

      <div className="w-full bg-gray-800 rounded-lg p-4 text-center shadow-md">
  <p className="text-2xl font-bold text-white">Total: ${totalPrice.toFixed(2)}</p>
</div>


      {paymentStatus && (
        <div className={`mb-4 p-3 rounded ${
          paymentStatus.includes('successful') 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {paymentStatus}
        </div>
      )}

      {invoiceUrl && (
        <div className="mb-4">
          <button
            type="button"
            onClick={handleDownloadInvoice}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Download Invoice
          </button>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Card Details</label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={isProcessing || !stripe}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

const StripePayment = ({ totalPrice, customerId }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm 
        totalPrice={totalPrice} 
        customerId={customerId} 
      />
    </Elements>
  );
};

export default StripePayment;