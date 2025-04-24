import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import './Subscription.css';

const SubscriptionPlans = () => {
  const navigate = useNavigate();

  const handlePlanSelection = (planType) => {
    // Store selected plan in localStorage
    localStorage.setItem('selectedPlan', JSON.stringify({
      type: planType,
      price: planType === 'normal' ? 5 : 10,
      registrationFee: 3
    }));
    
    // Navigate to signup page
    navigate('/signup');
  };

  return (
    <div className="subscription-page">
      <Navigation />
      <div className="subscription-container">
        <h1>Choose Your Plan</h1>
        <p className="subtitle">Select the perfect plan for your reading journey</p>

        <div className="plans-container">
          <div className="plan-card">
            <h2>Normal</h2>
            <div className="price">
              <span className="amount">$5</span>
              <span className="period">/month</span>
            </div>
            <ul className="features">
              <li>Borrow up to 3 books</li>
              <li>20-day return period</li>
              <li>Book return alerts</li>
              <li>Basic support</li>
            </ul>
            <div className="registration-fee">
              <p>One-time registration fee: $3</p>
            </div>
            <button 
              onClick={() => handlePlanSelection('normal')} 
              className="plan-button"
            >
              Sign Up
            </button>
          </div>

          <div className="plan-card premium">
            <h2>Premium</h2>
            <div className="price">
              <span className="amount">$10</span>
              <span className="period">/month</span>
            </div>
            <ul className="features">
              <li>Unlimited book purchases</li>
              <li>45-day return period</li>
              <li>Priority book access</li>
              <li>Premium support</li>
            </ul>
            <div className="registration-fee">
              <p>One-time registration fee: $3</p>
            </div>
            <button 
              onClick={() => handlePlanSelection('premium')} 
              className="plan-button"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans; 