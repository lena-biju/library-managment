import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import './AccountPage.css';

const AccountPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      navigate('/');
      return;
    }
    try {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
    } catch (e) {
      console.error('Error parsing user data:', e);
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userStatus');
    navigate('/');
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="account-page">
      <Navigation />
      
      <main className="account-content">
        <div className="account-header">
          <h1>Welcome back, {currentUser.name}!</h1>
          <button onClick={handleLogout} className="logout-btn">
            Log out
          </button>
        </div>

        <div className="account-sections">
          <section className="account-info">
            <h2>Account Information</h2>
            <div className="info-card">
              <p><strong>Name:</strong> {currentUser.name}</p>
              <p><strong>Phone:</strong> {currentUser.phone}</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
              <p><strong>Member Since:</strong> {new Date().toLocaleDateString()}</p>
            </div>
          </section>

          <section className="my-books">
            <h2>My Books</h2>
            <div className="books-grid">
              <div className="book-card">
                <h3>Currently Reading</h3>
                {/* Add book cards here */}
              </div>
              <div className="book-card">
                <h3>Recently Purchased</h3>
                {/* Add book cards here */}
              </div>
              <div className="book-card">
                <h3>Reading History</h3>
                {/* Add book cards here */}
              </div>
            </div>
          </section>

          <section className="preferences">
            <h2>Preferences</h2>
            <div className="preferences-card">
              <div className="preference-item">
                <h3>Favorite Genres</h3>
                <div className="genre-tags">
                  <span className="tag">Adventure</span>
                  <span className="tag">Sci-Fi</span>
                  <span className="tag">Fantasy</span>
                </div>
              </div>
              <div className="preference-item">
                <h3>Reading Goals</h3>
                <p>Books read this month: 2</p>
                <p>Reading goal: 4 books/month</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountPage; 