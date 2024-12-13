import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Load your Stripe publishable key
const stripePromise = loadStripe("your-publishable-key-here");

const CheckoutForm = ({ totalPrice }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return; // Stripe.js has not loaded yet
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.error("Payment Method Error:", error);
    } else {
      console.log("Payment Method Success:", paymentMethod);
      // Pass paymentMethod.id and totalPrice to your server to confirm payment
      console.log("Total Amount:", totalPrice);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white shadow-md rounded px-8 py-6">
      <h2 className="text-2xl font-bold mb-4">Payment Form</h2>
      <div className="mb-4">
        <p className="text-lg font-semibold">Total Amount: ${totalPrice}</p>
      </div>
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
      <button
        type="submit"
        disabled={!stripe}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 focus:ring focus:ring-indigo-300 disabled:opacity-50"
      >
        Pay Now
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
