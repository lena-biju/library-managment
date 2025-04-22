import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import './Account.css';

const Account = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const currentUser = JSON.parse(userData);
      setUser(currentUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleDashboardClick = () => {
    // Ensure we're setting librarian status before navigating
    localStorage.setItem('userStatus', 'librarian');
    localStorage.setItem('dashboardActiveTab', 'books');
    navigate('/librarian-dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userStatus');
    localStorage.removeItem('dashboardActiveTab');
    navigate('/');
  };

  if (!user) return null;

  // Check if user is librarian - match the login component's data structure
  const isLibrarian = user.role === 'librarian' || localStorage.getItem('userStatus') === 'librarian';

  return (
    <div>
      <Navigation />
      <div className="account-container">
        <div className="account-header">
          <h1>Welcome back, {isLibrarian ? 'Library Admin' : user.name}!</h1>
          <div className="header-actions">
            {isLibrarian && (
              <button 
                className="dashboard-btn" 
                onClick={handleDashboardClick}
              >
                Dashboard
              </button>
            )}
            <button 
              className="logout-btn" 
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </div>
        
        <div className="account-section">
          <h2>Account Information</h2>
          <div className="info-item">
            <span className="label">Name:</span>
            <span className="value">{user.name}</span>
          </div>
          <div className="info-item">
            <span className="label">Phone:</span>
            <span className="value">{user.phone}</span>
          </div>
          <div className="info-item">
            <span className="label">Email:</span>
            <span className="value">{user.email || '-'}</span>
          </div>
          <div className="info-item">
            <span className="label">Member Since:</span>
            <span className="value">{user.memberSince || '22/4/2025'}</span>
          </div>
        </div>

        <div className="books-section">
          <h2>My Books</h2>
          <div className="books-container">
            <div className="books-column">
              <h3>Purchased Books</h3>
              <div className="books-list">
                <p className="no-books">No purchased books yet</p>
              </div>
            </div>
            <div className="books-column">
              <h3>Rented Books</h3>
              <div className="books-list">
                <p className="no-books">No rented books yet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account; 