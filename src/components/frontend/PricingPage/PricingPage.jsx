import React from 'react';
import Navigation from '../Navigation/Navigation';
import './PricingPage.css';

const PricingPage = () => {
  const plans = [
    {
      name: 'Normal',
      price: '$5',
      features: [
        'Borrow up to 3 books',
        '20-day return period',
        'Book return alerts',
        'Basic support'
      ]
    },
    {
      name: 'Premium',
      price: '$10',
      features: [
        'Unlimited book purchases',
        '45-day return period',
        'Priority book access',
        'Premium support'
      ]
    }
  ];

  return (
    <div className="pricing-page">
      <Navigation />
      <div className="container">
        <h1 className="text-center">Choose Your Plan</h1>
        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div key={index} className="pricing-card paper-effect">
              <h2>{plan.name}</h2>
              <div className="price">{plan.price}<span>/month</span></div>
              <ul className="features">
                {plan.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
              <button className="subscribe-btn">Subscribe Now</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage; 