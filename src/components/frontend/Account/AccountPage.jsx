import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import './AccountPage.css';

const AccountPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userBooks, setUserBooks] = useState({ purchased: [], rented: [] });
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

      // Load user's transactions
      const userTransactions = JSON.parse(localStorage.getItem('userTransactions') || '{}');
      const transactions = userTransactions[user.phone] || { purchased: [], rented: [] };
      setUserBooks(transactions);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
              <div className="book-section purchased">
                <h3>Purchased Books</h3>
                <div className="books-list">
                  {userBooks.purchased.length > 0 ? (
                    userBooks.purchased.map((transaction, index) => (
                      <div key={index} className="book-item">
                        <img src={transaction.coverImage} alt={transaction.bookTitle} className="book-cover" />
                        <div className="book-details">
                          <h4>{transaction.bookTitle}</h4>
                          <p>Purchased on: {formatDate(transaction.date)}</p>
                          <p className="price">Paid: ${transaction.amount}</p>
                          <Link to={`/book/${transaction.bookId}`} className="view-book">
                            View Book
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-books">No purchased books yet</p>
                  )}
                </div>
              </div>

              <div className="book-section rented">
                <h3>Rented Books</h3>
                <div className="books-list">
                  {userBooks.rented.length > 0 ? (
                    userBooks.rented.map((transaction, index) => (
                      <div key={index} className="book-item">
                        <img src={transaction.coverImage} alt={transaction.bookTitle} className="book-cover" />
                        <div className="book-details">
                          <h4>{transaction.bookTitle}</h4>
                          <p>Rented on: {formatDate(transaction.date)}</p>
                          <p className="price">Monthly fee: ${transaction.amount}</p>
                          <Link to={`/book/${transaction.bookId}`} className="view-book">
                            View Book
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-books">No rented books yet</p>
                  )}
                </div>
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
                <p>Books read this month: {userBooks.purchased.length + userBooks.rented.length}</p>
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