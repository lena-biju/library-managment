import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/frontend/HomePage/HomePage';
import LoginPage from './components/frontend/Auth/LoginPage';
import SignupPage from './components/frontend/Auth/SignupPage';
import LibrarianDashboard from './components/frontend/LibrarianDashboard/LibrarianDashboard';
import AccountPage from './components/frontend/Account/AccountPage';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/librarian-dashboard" element={<LibrarianDashboard />} />
      </Routes>
    </Router>
  );
};

export default App; 