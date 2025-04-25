import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import './RegistrationCheckout.css';

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

  const handlePayment = (event) => {
    event.preventDefault();
    // Simple mock payment process
    alert('Payment Successful!');
    
    // Get existing users array
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Add payment and subscription details to user data
    const userWithSubscription = {
      ...userData,
      subscriptionStartDate: new Date().toISOString(),
      subscriptionStatus: 'active'
    };
    
    // Add the new user to the array
    existingUsers.push(userWithSubscription);
    
    // Save to localStorage
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
    
    // Navigate to login
    navigate('/login');
  };

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
                <img src="/assets/images/payment/rupay.png" alt="Rupay" />
              </div>
            </div>
            
            <form onSubmit={handlePayment} className="checkout-form">
              <div className="form-group">
                <label htmlFor="card-number">Card Number*</label>
                <input 
                  type="text" 
                  id="card-number" 
                  className="form-input" 
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  required
                />
              </div>

              <div className="form-row-split">
                <div className="form-group half">
                  <label htmlFor="exp-month">Exp. Month*</label>
                  <select id="exp-month" className="form-select" required>
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
                  <select id="exp-year" className="form-select" required>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = (new Date().getFullYear() + i).toString();
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
                <label htmlFor="cvv">CVV*</label>
                <input 
                  type="text" 
                  id="cvv" 
                  className="form-input" 
                  placeholder="123"
                  maxLength="4"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="name-on-card">Name on Card*</label>
                <input 
                  type="text" 
                  id="name-on-card" 
                  className="form-input" 
                  placeholder="Name as shown on card"
                  defaultValue={userData.name}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
                  Cancel
                </button>
                <button type="submit" className="pay-now-btn">
                  Pay Now ${amount.toFixed(2)}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegistrationCheckout; 