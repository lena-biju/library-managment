import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import HomePage from './components/frontend/HomePage/HomePage';
import LoginPage from './components/frontend/Auth/LoginPage';
import SignupPage from './components/frontend/Auth/SignupPage';
import PaymentPage from './components/frontend/Payment/PaymentPage';
import LibrarianDashboard from './components/frontend/LibrarianDashboard/LibrarianDashboard';
import AccountPage from './components/frontend/Account/AccountPage';
import './App.css';

// Initialize Stripe with environment variable
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const App = () => {
  return (
    <Elements stripe={stripePromise}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/librarian-dashboard" element={<LibrarianDashboard />} />
        </Routes>
      </Router>
    </Elements>
  );
};

export default App; 