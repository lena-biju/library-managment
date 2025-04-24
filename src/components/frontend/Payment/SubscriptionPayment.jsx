import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import './SubscriptionPayment.css';

const SubscriptionPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount, userData, planType } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showQR, setShowQR] = useState(false);
  const [contactDetails, setContactDetails] = useState({
    phone: userData?.phone || '',
    email: userData?.email || ''
  });

  // Redirect if no payment data
  if (!amount || !userData || !planType) {
    navigate('/signup');
    return null;
  }

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setShowQR(method === 'upi');
  };

  const handleProceed = () => {
    if (paymentMethod === 'upi') {
      setShowQR(true);
    } else {
      // Navigate to card payment page
      navigate('/registration-checkout', {
        state: { amount, userData, planType }
      });
    }
  };

  return (
    <div className="subscription-payment-page">
      <Navigation />
      
      <main className="payment-content">
        <div className="payment-container">
          <div className="payment-left">
            <h2>Checkout</h2>
            
            <div className="payment-methods">
              <div className="accepted-cards">
                <img src="/assets/images/payment/visa.png" alt="Visa" />
                <img src="/assets/images/payment/mastercard.png" alt="Mastercard" />
                <img src="/assets/images/payment/rupay.png" alt="RuPay" />
                <span className="card-note">Debit card with ICICI, Citibank and Kotak only</span>
              </div>

              {showQR ? (
                <div className="qr-section">
                  <h3>Pay With UPI QR</h3>
                  <div className="qr-container">
                    <div className="qr-placeholder">
                      <button className="show-qr-btn">Show QR</button>
                    </div>
                    <p>Scan the QR using any UPI app on your phone.</p>
                    <div className="upi-apps">
                      <img src="/assets/images/payment/gpay.png" alt="Google Pay" />
                      <img src="/assets/images/payment/phonepe.png" alt="PhonePe" />
                      <img src="/assets/images/payment/paytm.png" alt="Paytm" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="payment-options">
                  <h3>Payment Options</h3>
                  <div className="option-list">
                    <button 
                      className={`option-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                      onClick={() => handlePaymentMethodChange('upi')}
                    >
                      <img src="/assets/images/payment/upi.png" alt="UPI" />
                      <span>UPI / QR</span>
                    </button>
                    <button 
                      className={`option-btn ${paymentMethod === 'bank' ? 'active' : ''}`}
                      onClick={() => handlePaymentMethodChange('bank')}
                    >
                      <img src="/assets/images/payment/bank.png" alt="Bank" />
                      <span>Bank Account</span>
                      <small>All Indian banks</small>
                    </button>
                    <button 
                      className={`option-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                      onClick={() => handlePaymentMethodChange('card')}
                    >
                      <img src="/assets/images/payment/card.png" alt="Card" />
                      <span>Card</span>
                      <small>MasterCard, Visa, and RuPay credit cards</small>
                    </button>
                  </div>

                  <div className="contact-details">
                    <h3>Contact Details</h3>
                    <div className="phone-input">
                      <select className="country-code">
                        <option value="+91">+91</option>
                      </select>
                      <input 
                        type="tel" 
                        value={contactDetails.phone}
                        onChange={(e) => setContactDetails({...contactDetails, phone: e.target.value})}
                        placeholder="Phone Number"
                      />
                    </div>
                    <input 
                      type="email"
                      value={contactDetails.email}
                      onChange={(e) => setContactDetails({...contactDetails, email: e.target.value})}
                      placeholder="Email"
                      className="email-input"
                    />
                  </div>

                  <button className="proceed-btn" onClick={handleProceed}>
                    Proceed
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="payment-right">
            <div className="subscription-details">
              <div className="subscription-header">
                <img src="/assets/images/logo.png" alt="Library Logo" className="subscription-logo" />
                <h3>Library Plus Subscription</h3>
              </div>
              <p className="subscription-desc">
                Unlimited access to books, e-books, and exclusive member benefits
              </p>
              <button className="remove-btn">Remove from cart</button>

              <div className="subscription-info">
                <p className="no-commitment">No commitment. Cancel anytime.</p>
                
                <div className="subscription-pricing">
                  <div className="pricing-row">
                    <span>Monthly subscription</span>
                    <span className="trial">7-Day Free Trial</span>
                  </div>
                  <div className="pricing-row">
                    <span>then ${amount}/mo</span>
                  </div>
                </div>

                <div className="pricing-breakdown">
                  <div className="price-row">
                    <span>Temporary charge</span>
                    <span>${amount}</span>
                  </div>
                  <p className="refund-note">Authorization hold will be refunded within 48 hours</p>
                </div>

                <div className="total-amount">
                  <span>Today's Total:</span>
                  <span>${amount}</span>
                </div>

                <p className="trial-note">
                  Your subscription begins today with a 7-day free trial. If you decide to stop during the trial period, 
                  visit My Purchases to cancel before {new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString()} and 
                  your card won't be charged. We can't issue refunds once your card is charged.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SubscriptionPayment; 