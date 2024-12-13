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

const CheckoutForm = ({ totalPrice }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create Payment Intent on backend
      const response = await axios.post('http://localhost:8080/api/payments/create-payment-intent', {
        amount: totalPrice,
        currency: 'usd'
      });

      const clientSecret = response.data;

      // 2. Confirm Payment
      const cardElement = elements.getElement(CardElement);
      
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: event.target.fullName.value
          }
        }
      });

      if (result.error) {
        setPaymentStatus('Payment failed: ' + result.error.message);
        console.error(result.error);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          setPaymentStatus('Payment successful!');
          // Handle successful payment (e.g., clear cart, show confirmation)
        }
      }
    } catch (error) {
      setPaymentStatus('Payment error: ' + error.message);
      console.error('Payment error', error);
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white shadow-md rounded px-8 py-6">
      <h2 className="text-2xl font-bold mb-4">Payment Details</h2>
      
      {/* Total Price Display */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6 text-center">
        <p className="text-xl font-bold text-gray-900">
          Total to Pay: ${totalPrice.toFixed(2)}
        </p>
      </div>

      {/* Payment Status */}
      {paymentStatus && (
        <div className={`mb-4 p-3 rounded ${
          paymentStatus.includes('successful') 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {paymentStatus}
        </div>
      )}

      {/* Name Input */}
      <label className="block mb-3">
        <span className="text-gray-700">Full Name</span>
        <input
          type="text"
          name="fullName"
          placeholder="John Doe"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </label>

      {/* Card Details */}
      <div className="block mb-3">
        <span className="text-gray-700">Card Details</span>
        <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#32325d",
                  fontFamily: "Arial, sans-serif",
                  "::placeholder": {
                    color: "#a0aec0",
                  },
                },
                invalid: {
                  color: "#fa755a",
                },
              },
            }}
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 focus:ring focus:ring-indigo-300 disabled:opacity-50"
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

const StripePayment = ({ totalPrice }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm totalPrice={totalPrice} />
    </Elements>
  );
};

export default StripePayment;