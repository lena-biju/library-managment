import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import './Auth.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [errors, setErrors] = useState({ phone: '', password: '' });
  const [touched, setTouched] = useState({ phone: false, password: false });

  const validateField = (name, value) => {
    switch (name) {
      case 'phone':
        return !/^\d{10}$/.test(value) ? 'Phone number must be exactly 10 digits' : '';
      case 'password':
        return !value ? 'Password is required' : '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, formData[name]) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({ phone: true, password: true });
    const newErrors = {
      phone: validateField('phone', formData.phone),
      password: validateField('password', formData.password)
    };
    setErrors(newErrors);

    if (!Object.values(newErrors).some(error => error !== '')) {
      try {
        // Check for librarian login
        if (formData.phone === '1234567890' && formData.password === 'admin123') {
          const librarianUser = {
            id: 'admin',
            name: 'Librarian',
            phone: formData.phone,
            role: 'librarian',
            email: 'admin@library.com'
          };

          localStorage.setItem('currentUser', JSON.stringify(librarianUser));
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userStatus', 'librarian');
          alert('Login successful! Welcome back, Librarian');
          navigate('/'); // Navigate to homepage instead of librarian dashboard
          return;
        }

        // Check for regular user
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const user = registeredUsers.find(u => u.phone === formData.phone);

        if (!user) {
          alert('No account found with this phone number. Please register first.');
          navigate('/signup'); // Navigate to signup page if user doesn't exist
          return;
        }

        if (user.password !== formData.password) {
          setErrors(prev => ({ ...prev, password: 'Incorrect password' }));
          return;
        }

        // Set user data in localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userStatus', user.role || 'normalUser');
        
        // Show success message
        alert('Login successful! Welcome back, ' + user.name);
        
        // Navigate to home page
        navigate('/');
      } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
      }
    }
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
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${touched.phone && errors.phone ? 'error' : ''}`}
                placeholder="Enter your phone number"
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
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${touched.password && errors.password ? 'error' : ''}`}
                placeholder="Enter your password"
              />
              {touched.password && errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
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