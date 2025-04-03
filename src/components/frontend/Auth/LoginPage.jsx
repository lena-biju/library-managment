import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import './Auth.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    phone: '',
    password: ''
  });

  const [touched, setTouched] = useState({
    phone: false,
    password: false
  });

  const validateField = (name, value) => {
    switch (name) {
      case 'phone':
        return !/^\d{10}$/.test(value) ? 'Please enter a valid 10-digit phone number' : '';
      case 'password':
        return !value ? 'Password is required' : '';
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
      // Check if user exists and is registered
      const userStatus = localStorage.getItem('userStatus');
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const user = registeredUsers.find(u => u.phone === formData.phone && u.password === formData.password);

      if (!user) {
        if (userStatus === 'newUser') {
          alert('Please register first to create an account. You will need to pay a small registration fee.');
          navigate('/signup');
          return;
        }
        alert('Invalid phone number or password. Please try again.');
        return;
      }

      // Login successful
      localStorage.setItem('userStatus', 'normalUser');
      localStorage.setItem('currentUser', JSON.stringify(user));
      alert('Login successful!');
      navigate('/');
    }
  };

  const getInputClassName = (fieldName) => {
    return `form-input ${touched[fieldName] && errors[fieldName] ? 'error' : ''}`;
  };

  return (
    <div className="auth-page">
      <Navigation />
      <div className="container">
        <div className="auth-card paper-effect">
          <h1>Welcome Back</h1>
          <p className="auth-subtitle">Login to your account</p>

          <form onSubmit={handleSubmit} noValidate>
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
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className={getInputClassName('password')}
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your password"
                required
              />
              {touched.password && errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="auth-btn">Login</button>
          </form>

          <p className="auth-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 