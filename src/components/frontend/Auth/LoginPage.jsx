import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import './Auth.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('user');
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
      if (selectedRole === 'librarian') {
        // Check librarian credentials (in a real app, this would be a server call)
        if (formData.phone === '1234567890' && formData.password === 'admin123') {
          localStorage.setItem('userStatus', 'librarian');
          localStorage.setItem('currentUser', JSON.stringify({
            ...formData,
            name: 'Library Admin',
            role: 'librarian'
          }));
          alert('Welcome, Library Admin!');
          navigate('/librarian-dashboard');
          return;
        } else {
          alert('Invalid librarian credentials.');
          return;
        }
      }

      // Regular user login
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const user = registeredUsers.find(u => u.phone === formData.phone && u.password === formData.password);

      if (!user) {
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

          <div className="role-selection">
            <button
              className={`role-button ${selectedRole === 'user' ? 'active' : ''}`}
              onClick={() => setSelectedRole('user')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              User
            </button>
            <button
              className={`role-button ${selectedRole === 'librarian' ? 'active' : ''}`}
              onClick={() => setSelectedRole('librarian')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
              </svg>
              Librarian
            </button>
          </div>

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
                placeholder={selectedRole === 'librarian' ? 'Enter admin phone number' : 'Enter your phone number'}
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
                placeholder={selectedRole === 'librarian' ? 'Enter admin password' : 'Enter your password'}
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

            <button type="submit" className="auth-btn">
              {selectedRole === 'librarian' ? 'Login as Librarian' : 'Login'}
            </button>
          </form>

          {selectedRole === 'user' && (
            <p className="auth-link">
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 