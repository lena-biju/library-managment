import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import './Auth.css';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  const [showPayment, setShowPayment] = useState(false);
  const registrationFee = 5.99;

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return !value ? 'Name is required' : '';
      case 'phone':
        return !/^\d{10}$/.test(value) ? 'Please enter a valid 10-digit phone number' : '';
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Please enter a valid email address' : '';
      case 'password':
        return !/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/.test(value)
          ? 'Password must contain at least 8 characters, one uppercase letter, one number, and one special character'
          : '';
      case 'confirmPassword':
        return value !== formData.password ? 'Passwords do not match' : '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, formData[name])
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      newErrors[key] = validateField(key, formData[key]);
    });
    setErrors(newErrors);
    
    // Check if there are any errors
    if (Object.values(newErrors).every(error => error === '')) {
      // Check if user already exists
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      if (registeredUsers.some(user => user.phone === formData.phone)) {
        alert('A user with this phone number already exists. Please login instead.');
        navigate('/login');
        return;
      }
      
      // Show payment section
      setShowPayment(true);
    }
  };

  const handlePayment = () => {
    // In a real application, this would integrate with a payment gateway
    // For demo purposes, we'll simulate a successful payment
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const newUser = {
      ...formData,
      status: 'normalUser'
    };
    
    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    localStorage.setItem('userStatus', 'normalUser');
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    alert('Registration successful! Please login with your credentials.');
    navigate('/login');
  };

  const getInputClassName = (fieldName) => {
    return `form-input ${touched[fieldName] && errors[fieldName] ? 'error' : ''}`;
  };

  return (
    <div className="auth-page">
      <Navigation />
      <div className="container">
        <div className="auth-card paper-effect">
          <h1>Create Account</h1>
          <p className="auth-subtitle">Join our book community</p>

          {!showPayment ? (
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={getInputClassName('name')}
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your full name"
                  required
                />
                {touched.name && errors.name && (
                  <span className="error-message">{errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={getInputClassName('phone')}
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your phone number"
                  required
                />
                {touched.phone && errors.phone && (
                  <span className="error-message">{errors.phone}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={getInputClassName('email')}
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your email"
                  required
                />
                {touched.email && errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={getInputClassName('password')}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Create a password"
                  required
                />
                {touched.password && errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={getInputClassName('confirmPassword')}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Confirm your password"
                  required
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <span className="error-message">{errors.confirmPassword}</span>
                )}
              </div>

              <button type="submit" className="auth-btn">Continue to Payment</button>
            </form>
          ) : (
            <div className="payment-section">
              <h2>Registration Fee</h2>
              <div className="fee-amount">₹{registrationFee}</div>
              <p className="fee-description">
                A small one-time registration fee is required to create your account.
                This helps us maintain the quality of our service and provide you with
                the best reading experience.
              </p>
              <button onClick={handlePayment} className="auth-btn">
                Pay Now
              </button>
              <button onClick={() => setShowPayment(false)} className="back-btn">
                Back to Form
              </button>
            </div>
          )}

          <p className="auth-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 