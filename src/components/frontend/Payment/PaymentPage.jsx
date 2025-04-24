import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Navigation from '../Navigation/Navigation';
import './Payment.css';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  // Get payment details from location state
  const { amount, userData, planType } = location.state || {};

  // If no payment details are present, redirect to home
  if (!amount || !userData || !planType) {
    navigate('/home');
    return null;
  }

  const handleCardChange = (event) => {
    setError(event.error ? event.error.message : '');
    setCardComplete(event.complete);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements || !cardComplete) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Create a payment method
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          name: userData.name,
          email: userData.email,
          phone: userData.phone
        }
      });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }

      // In a real application, you would:
      // 1. Send paymentMethod.id to your server
      // 2. Create a payment intent
      // 3. Confirm the payment
      // For demo, we'll simulate success
      console.log('Payment Method:', paymentMethod);
      
      // Get existing users array
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      // Add subscription details to user data
      const userWithSubscription = {
        ...userData,
        paymentMethod: paymentMethod.id,
        subscriptionStartDate: new Date().toISOString(),
        subscriptionStatus: 'active'
      };
      
      // Add the new user to the array
      existingUsers.push(userWithSubscription);
      
      // Save updated users array
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

      // Show success message
      alert('Payment successful! Please login to your account.');
      
      // Navigate to login page
      navigate('/login');
    } catch (err) {
      console.error('Payment error:', err);
      setError('An unexpected error occurred. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <div className="payment-page">
      <Navigation />
      <div className="payment-container">
        <div className="payment-card paper-effect">
          <h1>Complete Payment</h1>
          <div className="payment-details">
            <h2>Payment Summary</h2>
            <div className="payment-summary">
              <p>Plan Type: <span>{planType === 'premium' ? 'Premium' : 'Normal'}</span></p>
              <p>Registration Fee: <span>$3.00</span></p>
              <p>Subscription Fee: <span>${planType === 'premium' ? '10.00' : '5.00'}</span></p>
              <p className="total">Total Amount: <span>${amount}.00</span></p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Card Information</label>
              <div className="card-element-container">
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
                    hidePostalCode: true
                  }}
                  onChange={handleCardChange}
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button 
              type="submit" 
              className="payment-button"
              disabled={!stripe || processing || !cardComplete}
            >
              {processing ? 'Processing...' : `Pay $${amount}`}
            </button>
          </form>

          <div className="payment-info">
            <p>Test Card: 4242 4242 4242 4242</p>
            <p>Expiry: Any future date</p>
            <p>CVC: Any 3 digits</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage; 