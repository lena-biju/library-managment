import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import { getBookById } from '../../../booksData';
import BookEditModal from '../LibrarianDashboard/BookEditModal';
import './BookDetail.css';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [bookContent, setBookContent] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [userTransactions, setUserTransactions] = useState({ purchased: [], rented: [] });
  const [isEditing, setIsEditing] = useState(false);
  const [isLibrarian, setIsLibrarian] = useState(false);

  useEffect(() => {
    // Check if user is librarian
    const userStatus = localStorage.getItem('userStatus');
    setIsLibrarian(userStatus === 'librarian');

    // Get current user from localStorage
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        
        // Get user's transactions
        const transactions = JSON.parse(localStorage.getItem('userTransactions') || '{}');
        setUserTransactions(transactions[user.phone] || { purchased: [], rented: [] });
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchBook = () => {
      const bookData = getBookById(parseInt(id));
      if (bookData) {
        setBook({
          ...bookData,
          coverImage: `/${bookData.cover_image}`,
          price: bookData.price || 29.99,
          rentPrice: bookData.rentPrice || 9.99,
          category: bookData.genre.join(', ')
        });

        // Check if user has access to this book
        if (currentUser) {
          const hasAccess = userTransactions.purchased.some(t => t.bookId === bookData.id) ||
                           userTransactions.rented.some(t => t.bookId === bookData.id);
          if (hasAccess) {
            loadBookContent(bookData.title);
          }
        }
      }
    };

    fetchBook();
  }, [id, currentUser, userTransactions]);

  const loadBookContent = async (title) => {
    try {
      const response = await fetch(`/assets/books/txt/${title.toLowerCase().replace(/ /g, '-')}.txt`);
      const text = await response.text();
      setBookContent(text);
    } catch (error) {
      console.error('Error loading book content:', error);
      setBookContent('Error loading book content. Please try again later.');
    }
  };

  const handleReadNow = () => {
    if (!currentUser) {
      alert('Please login to read this book.');
      navigate('/login');
      return;
    }

    const hasAccess = userTransactions.purchased.some(t => t.bookId === parseInt(id)) ||
                     userTransactions.rented.some(t => t.bookId === parseInt(id));

    if (!hasAccess) {
      alert('Please purchase or rent this book to read it.');
      return;
    }

    setShowContent(true);
  };

  const handleBookSave = (updatedBook) => {
    // Get all books from localStorage
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    
    // Update the book in the array
    const updatedBooks = books.map(b => 
      b.id === updatedBook.id ? updatedBook : b
    );
    
    // Save back to localStorage
    localStorage.setItem('books', JSON.stringify(updatedBooks));
    
    // Update the current book state
    setBook({
      ...updatedBook,
      coverImage: `/${updatedBook.cover_image}`,
      category: updatedBook.genre.join(', ')
    });
    
    setIsEditing(false);
    alert('Book updated successfully!');
  };

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

  const hasAccess = currentUser && (
    userTransactions.purchased.some(t => t.bookId === parseInt(id)) ||
    userTransactions.rented.some(t => t.bookId === parseInt(id))
  );

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
            {isLibrarian && (
              <button 
                className="edit-btn"
                onClick={() => setIsEditing(true)}
              >
                <i className="fas fa-edit"></i> Edit Book
              </button>
            )}
            <img src={book.coverImage} alt={book.title} className="book-cover" />
            <div className="book-actions">
              {hasAccess ? (
                <button 
                  className="action-btn read-btn"
                  onClick={handleReadNow}
                >
                  Read Now
                </button>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>

          <div className="book-info-section">
            <h1>{book.title}</h1>
            <h2>by {book.author.name}</h2>
            
            <div className="book-meta">
              <span className="category">{book.category}</span>
              <div className="rating">
                <span className="stars">{'★'.repeat(Math.floor(book.rating))}{'☆'.repeat(5 - Math.floor(book.rating))}</span>
                <span className="rating-count">({book.reviews.length} reviews)</span>
              </div>
            </div>

            <div className="book-description">
              <h3>About this book</h3>
              <p>{book.description}</p>
            </div>

            {hasAccess && showContent ? (
              <div className="book-content">
                <h3>Book Content</h3>
                <div className="content-container">
                  {bookContent.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="membership-note">
                <h3>Access Information</h3>
                {currentUser ? (
                  hasAccess ? (
                    <div className="user-welcome">
                      <p>Click "Read Now" to start reading!</p>
                    </div>
                  ) : (
                    <div className="user-welcome">
                      <p>Purchase or rent this book to start reading.</p>
                    </div>
                  )
                ) : (
                  <>
                    <p>Login or register to access our library of books!</p>
                    <button 
                      className="register-btn"
                      onClick={() => navigate('/signup')}
                    >
                      Register Now
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {isEditing && (
        <BookEditModal
          book={book}
          onSave={handleBookSave}
          onClose={() => setIsEditing(false)}
        />
      )}

      <Footer />
    </div>
  );
};

export default BookDetail; 