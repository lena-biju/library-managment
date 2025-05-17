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
    subscriptionType: 'normal',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    subscriptionType: '',
    password: '',
    confirmPassword: ''
  });

  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    email: false,
    subscriptionType: false,
    password: false,
    confirmPassword: false
  });

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.trim() === '' ? 'Name is required' : '';
      case 'phone':
        return !/^\d{10}$/.test(value) 
          ? 'Phone number must be exactly 10 digits' 
          : '';
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? 'Please enter a valid email address'
          : '';
      case 'password':
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(value)) {
          return 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)';
        }
        return '';
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

    if (name === 'password' && touched.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: formData.confirmPassword !== value ? 'Passwords do not match' : ''
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

  const handleContinueToPayment = () => {
    // Mark all fields as touched
    const allTouched = Object.keys(touched).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});
    setTouched(allTouched);

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      newErrors[key] = validateField(key, formData[key]);
    });
    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    
    if (!hasErrors) {
      try {
        // Get existing users or initialize empty array
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        
        // Check for existing user
        if (existingUsers.some(user => user.email === formData.email)) {
          setErrors(prev => ({
            ...prev,
            email: 'An account with this email already exists'
          }));
          return;
        }

        if (existingUsers.some(user => user.phone === formData.phone)) {
          setErrors(prev => ({
            ...prev,
            phone: 'An account with this phone number already exists'
          }));
          return;
        }

        // Calculate total amount based on subscription type
        const totalAmount = formData.subscriptionType === 'premium' ? 10 : 5;

        // Create new user object
        const newUser = {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: 'normalUser',
          subscriptionPlan: formData.subscriptionType,
          subscriptionFee: totalAmount,
          createdAt: new Date().toISOString(),
          library: {
            borrowed: [],
            purchased: [],
            wishlist: []
          }
        };

        // Navigate to subscription payment page
        navigate('/subscription-payment', {
          state: {
            amount: totalAmount,
            userData: newUser,
            planType: formData.subscriptionType
          }
        });
      } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="auth-page">
      <Navigation />
      <div className="container">
        <div className="auth-card paper-effect">
          <h1>Create Account</h1>
          <p className="auth-subtitle">Join our book community</p>

          <div className="signup-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${touched.name && errors.name ? 'error' : ''}`}
                placeholder="Enter your full name"
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
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${touched.phone && errors.phone ? 'error' : ''}`}
                placeholder="Enter 10-digit phone number"
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
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${touched.email && errors.email ? 'error' : ''}`}
                placeholder="Enter your email address"
              />
              {touched.email && errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="subscriptionType">Subscription Type</label>
              <select
                id="subscriptionType"
                name="subscriptionType"
                value={formData.subscriptionType}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${touched.subscriptionType && errors.subscriptionType ? 'error' : ''}`}
              >
                <option value="normal">Normal Plan ($5/month)</option>
                <option value="premium">Premium Plan ($10/month)</option>
              </select>
              {touched.subscriptionType && errors.subscriptionType && (
                <span className="error-message">{errors.subscriptionType}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${touched.password && errors.password ? 'error' : ''}`}
                placeholder="Create a strong password"
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
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${touched.confirmPassword && errors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirm your password"
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>

            <button 
              type="button" 
              className="auth-btn" 
              onClick={handleContinueToPayment}
            >
              Continue to Payment
            </button>
          </div>

          <p className="auth-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 