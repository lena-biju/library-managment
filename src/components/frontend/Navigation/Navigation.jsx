import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css';
import logo from '../../../assets/logo.svg';

const Navigation = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current user from localStorage
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userStatus');
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <nav className="navigation">
      <div className="nav-left">
        <Link to="/" className="nav-logo">
          <img src={logo} alt="ByteBooks Logo" className="logo-image" />
          <span>BYTEBOOKS</span>
        </Link>
      </div>
      
      <div className="nav-center">
        <Link to="/" className="nav-link">Home</Link>
        <div className="dropdown">
          <Link to="/books" className="nav-link">Books ▾</Link>
        </div>
        <div className="dropdown">
          <Link to="/e-books" className="nav-link">E-Books ▾</Link>
        </div>
        <Link to="/pricing" className="nav-link">Pricing</Link>
      </div>

      <div className="nav-right">
        <div className="search-container">
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>
        {currentUser ? (
          <Link to="/account" className="user-name">
            {currentUser.name}
          </Link>
        ) : (
          <Link to="/signup" className="signup-btn">Sign up</Link>
        )}
      </div>
    </nav>
  );
};

export default Navigation; 