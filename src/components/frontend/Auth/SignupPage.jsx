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
          ? 'Please enter a valid email address (e.g., user@example.com)'
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

    // Special handling for confirmPassword
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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

        // Get subscription plan from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const planType = urlParams.get('plan');
        const subscriptionFee = planType === 'premium' ? 10 : 5;
        const registrationFee = 3;
        const totalAmount = subscriptionFee + registrationFee;

        // Create new user object
        const newUser = {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: 'normalUser',
          subscriptionPlan: planType || 'normal',
          subscriptionFee: subscriptionFee,
          createdAt: new Date().toISOString(),
          library: {
            borrowed: [],
            purchased: [],
            wishlist: []
          }
        };

        // Show payment confirmation
        const paymentConfirmed = window.confirm(
          `Total Payment: $${totalAmount}\n` +
          `- Registration Fee: $${registrationFee}\n` +
          `- ${planType === 'premium' ? 'Premium' : 'Normal'} Plan: $${subscriptionFee}\n\n` +
          'Click OK to proceed with payment'
        );

        if (!paymentConfirmed) {
          return;
        }

        // Navigate to payment page with user data and payment details
        navigate('/payment', {
          state: {
            amount: totalAmount,
            userData: newUser,
            planType: planType || 'normal'
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

          <form onSubmit={handleSubmit} noValidate>
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

            <button type="submit" className="auth-btn">
              Register
            </button>
          </form>

          <p className="auth-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;