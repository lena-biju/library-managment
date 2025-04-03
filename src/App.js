import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/frontend/HomePage/HomePage';
import BookDetail from './components/frontend/Books/BookDetail';
import BrowsePage from './components/frontend/BrowsePage/BrowsePage';
import PricingPage from './components/frontend/PricingPage/PricingPage';
import SignupPage from './components/frontend/Auth/SignupPage';
import LoginPage from './components/frontend/Auth/LoginPage';
import AccountPage from './components/frontend/Account/AccountPage';
import CheckoutPage from './components/frontend/CheckoutPage/CheckoutPage';
import './App.css';

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

// Add Font Awesome icons to library
library.add(fas, far);

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books" element={<BrowsePage type="physical" />} />
          <Route path="/e-books" element={<BrowsePage type="digital" />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/category/:category" element={<BrowsePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/checkout/:id" element={<CheckoutPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
