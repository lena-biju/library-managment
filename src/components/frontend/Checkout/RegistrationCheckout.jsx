import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import './RegistrationCheckout.css';

// Initialize Stripe with a test public key
const stripePromise = loadStripe('pk_test_51O5QN5SCR7aQtYVlHlPFPaELxKIOZxIqXXrVMxJL5Zw0Gg7Q5JKqR8zwJ0EkOzZR0YhqFE4BPF1oRPat0LkT00Hy00Hs1bb7Uy');

const CheckoutForm = ({ amount, planType, userData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showPaymentOverlay, setShowPaymentOverlay] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('processing');
  const navigate = useNavigate();

  const handlePayment = (event) => {
    event.preventDefault();
    
    // Start payment process
    setShowPaymentOverlay(true);
    setProcessing(true);
    setPaymentStatus('processing');
    setError(null);

    // Simulate payment process
    setTimeout(() => {
      try {
        // Get existing users array
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        
        // Add payment and subscription details to user data
        const userWithSubscription = {
          ...userData,
          paymentMethod: 'card',
          subscriptionStartDate: new Date().toISOString(),
          subscriptionStatus: 'active'
        };
        
        // Add the new user to the array
        existingUsers.push(userWithSubscription);
        
        // Save to localStorage
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
        localStorage.setItem('currentUser', JSON.stringify(userWithSubscription));

        // Show success state
        setPaymentStatus('success');
        
        // Redirect after success
        setTimeout(() => {
          navigate('/account');
        }, 1500);

      } catch (error) {
        setError('Payment processing failed. Please try again.');
        setPaymentStatus('error');
      }
    }, 2000);
  };

  return (
    <>
      <form onSubmit={handlePayment} className="checkout-form">
        <div className="form-group">
          <label htmlFor="card-element">Card Details*</label>
          <div className="card-input-container">
            <CardElement
              id="card-element"
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#333',
                    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                    '::placeholder': {
                      color: '#aab7c4'
                    }
                  },
                  invalid: {
                    color: '#dc3545'
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="name-on-card">Name on Card</label>
          <input 
            type="text" 
            id="name-on-card" 
            className="form-input" 
            placeholder="Name as shown on card"
            defaultValue={userData.name}
          />
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button 
            type="submit" 
            className="pay-now-btn" 
            disabled={!stripe || processing}
          >
            {processing ? (
              <span className="processing">
                <span className="spinner-small"></span>
                Processing...
              </span>
            ) : (
              <>Pay Now ${amount.toFixed(2)}</>
            )}
          </button>
        </div>
      </form>

      {showPaymentOverlay && (
        <div className="payment-overlay">
          <div className="payment-overlay-content">
            {paymentStatus === 'processing' && (
              <>
                <div className="payment-animation">
                  <div className="spinner"></div>
                </div>
                <h3>Processing Your Payment</h3>
                <p>Please wait while we process your payment...</p>
              </>
            )}
            
            {paymentStatus === 'success' && (
              <>
                <div className="payment-animation">
                  <div className="success-checkmark">✓</div>
                </div>
                <h3>Payment Successful!</h3>
                <p>Thank you for subscribing to our {planType} plan.</p>
                <p className="redirect-notice">Redirecting to your account...</p>
              </>
            )}

            {paymentStatus === 'error' && (
              <>
                <div className="payment-animation">
                  <div className="error-icon">✕</div>
                </div>
                <h3>Payment Failed</h3>
                <p className="payment-error">{error}</p>
                <button 
                  className="try-again-btn"
                  onClick={() => {
                    setShowPaymentOverlay(false);
                    setProcessing(false);
                    setPaymentStatus('processing');
                    setError(null);
                  }}
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const RegistrationCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get registration details from location state
  const { amount, userData, planType } = location.state || {};

  // If no registration details are present, redirect to home
  if (!amount || !userData || !planType) {
    navigate('/');
    return null;
  }

  return (
    <div className="checkout-page">
      <Navigation />
      
      <main className="checkout-content paper-background">
        <div className="checkout-container">
          <div className="order-summary">
            <h2>Registration Summary</h2>
            <div className="plan-info">
              <div className="plan-details">
                <h3>{planType === 'premium' ? 'Premium' : 'Normal'} Plan</h3>
                <p className="user-name">{userData.name}</p>
                <p className="user-email">{userData.email}</p>
                <div className="price-breakdown">
                  <p>Subscription Fee: <span>${amount.toFixed(2)}</span></p>
                  <p className="total">Total Amount: <span>${amount.toFixed(2)}</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="payment-section">
            <div className="payment-header">
              <h2>Payment Information</h2>
              <div className="card-brands">
                <img src="/assets/images/payment/visa.png" alt="Visa" />
                <img src="/assets/images/payment/mastercard.png" alt="Mastercard" />
                <img src="/assets/images/payment/amex.png" alt="American Express" />
                <img src="/assets/images/payment/discover.png" alt="Discover" />
              </div>
            </div>
            <Elements stripe={stripePromise}>
              <CheckoutForm 
                amount={amount} 
                planType={planType}
                userData={userData}
              />
            </Elements>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegistrationCheckout; 