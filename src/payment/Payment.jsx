import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_payment_key);

const Payment = () => {
    return (
        <Elements stripe={stripePromise}>
        </Elements>
    );
}

export default Payment;
