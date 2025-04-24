import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import './RegistrationCheckout.css';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ amount, planType, userData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showPaymentOverlay, setShowPaymentOverlay] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('processing');
  const navigate = useNavigate();

  const handlePayment = async (event) => {
    event.preventDefault();
    setShowPaymentOverlay(true);
    setProcessing(true);
    setPaymentStatus('processing');
    setError(null);

    if (!stripe || !elements) {
      setError('Payment processing is not available. Please try again later.');
      setProcessing(false);
      setPaymentStatus('error');
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (error) {
        setError(error.message);
        setProcessing(false);
        setPaymentStatus('error');
      } else {
        // Get existing users array
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        
        // Add payment and subscription details to user data
        const userWithSubscription = {
          ...userData,
          paymentMethod: paymentMethod.id,
          subscriptionStartDate: new Date().toISOString(),
          subscriptionStatus: 'active'
        };
        
        // Add the new user to the array
        existingUsers.push(userWithSubscription);
        
        // Save to localStorage
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

        // Show success state and redirect after delay
        setTimeout(() => {
          setPaymentStatus('success');
          setTimeout(() => {
            navigate('/login');
          }, 1500);
        }, 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setProcessing(false);
      setPaymentStatus('error');
    }
  };

  return (
    <>
      <form onSubmit={handlePayment} className="checkout-form">
        <div className="form-group">
          <label htmlFor="card-number">Card Number*</label>
          <div className="card-input-container">
            <CardElement
              id="card-number"
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

        <div className="form-row-split">
          <div className="form-group half">
            <label htmlFor="exp-month">Exp. Month*</label>
            <select id="exp-month" className="form-select">
              {Array.from({ length: 12 }, (_, i) => {
                const month = (i + 1).toString().padStart(2, '0');
                return (
                  <option key={month} value={month}>
                    {month}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-group half">
            <label htmlFor="exp-year">Exp. Year*</label>
            <select id="exp-year" className="form-select">
              {Array.from({ length: 10 }, (_, i) => {
                const year = (new Date().getFullYear() + i).toString().slice(-2);
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="security-code">Security Code*</label>
          <input type="text" id="security-code" className="form-input" maxLength="4" />
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
          <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>CANCEL</button>
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
                <h3>Registration Successful!</h3>
                <p>Thank you for subscribing to our {planType} plan.</p>
                <p className="redirect-notice">Redirecting to login...</p>
              </>
            )}

            {paymentStatus === 'error' && (
              <>
                <div className="payment-animation">
                  <div className="error-icon">✕</div>
                </div>
                <h3>Payment Failed</h3>
                <div className="payment-error">{error}</div>
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
                  <p>Registration Fee: <span>$3.00</span></p>
                  <p>Subscription Fee: <span>${(amount - 3).toFixed(2)}</span></p>
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