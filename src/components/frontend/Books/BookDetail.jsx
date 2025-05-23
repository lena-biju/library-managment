import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import './BookDetail.css';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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

  // Simulated book data - In real app, fetch from API
  useEffect(() => {
    // Simulate API call
    const fetchBook = () => {
      const bookData = {
        id,
        title: 'The Martian',
        author: 'Andy Weir',
        coverImage: '/images/books/the-martian.jpg',
        description: "Six days ago, astronaut Mark Watney became one of the first people to walk on Mars. Now, he's sure he'll be the first person to die there. After a dust storm nearly kills him and forces his crew to evacuate while thinking him dead, Mark finds himself stranded and completely alone with no way to even signal Earth that he's alive—and even if he could get word out, his supplies would be gone long before a rescue could arrive.",
        price: 29.99,
        rentPrice: 9.99,
        category: 'SCI-FI',
        rating: 4.5,
        reviews: 1250
      };
      setBook(bookData);
    };

    fetchBook();
  }, [id]);

  const checkUserStatus = () => {
    // Check if user exists in localStorage
    const user = localStorage.getItem('currentUser');
    if (!user) {
      // If no user exists, set status to newUser
      localStorage.setItem('userStatus', 'newUser');
      return 'newUser';
    }
    
    // If user exists, check their status
    const userStatus = localStorage.getItem('userStatus');
    return userStatus || 'newUser';
  };

  const handleAction = (action) => {
    const userStatus = checkUserStatus();
    
    if (userStatus === 'newUser') {
      alert('Please register first to create an account. You will need to pay a small registration fee.');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
      return;
    }

    if (userStatus === 'normalUser') {
      // Proceed with buy/rent action
      navigate(`/checkout/${id}?action=${action}`);
    } else {
      // If not logged in, redirect to login
      alert('Please login to continue');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    }
  };

  if (!book) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="book-detail-page">
      <Navigation />
      
      <main className="book-detail-content paper-background">
        {showLoginAlert && (
          <div className="alert">
            Please login or register first to continue. Redirecting to login page...
          </div>
        )}

        <div className="book-detail-container">
          <div className="book-image-section">
            <img src={book.coverImage} alt={book.title} className="book-cover" />
            <div className="book-actions">
              <button 
                className="action-btn buy-btn"
                onClick={() => handleAction('buy')}
              >
                Buy - ${book.price}
              </button>
              <button 
                className="action-btn rent-btn"
                onClick={() => handleAction('rent')}
              >
                Rent - ${book.rentPrice}/month
              </button>
            </div>
          </div>

          <div className="book-info-section">
            <h1>{book.title}</h1>
            <h2>by {book.author}</h2>
            
            <div className="book-meta">
              <span className="category">{book.category}</span>
              <div className="rating">
                <span className="stars">{'★'.repeat(Math.floor(book.rating))}{'☆'.repeat(5 - Math.floor(book.rating))}</span>
                <span className="rating-count">({book.reviews} reviews)</span>
              </div>
            </div>

            <div className="book-description">
              <h3>About this book</h3>
              <p>{book.description}</p>
            </div>

            <div className="membership-note">
              <h3>Membership Benefits</h3>
              {currentUser ? (
                <div className="user-welcome">
                  <p>Welcome, {currentUser.name}!</p>
                  <p>Enjoy our full library of books as a registered member.</p>
                </div>
              ) : (
                <>
                  <p>Become a member to access our full library of books! Registration fee: $5.99</p>
                  <button 
                    className="register-btn"
                    onClick={() => navigate('/signup')}
                  >
                    Register Now
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookDetail; 