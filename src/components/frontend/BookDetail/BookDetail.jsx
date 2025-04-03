import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import { getBookById } from '../../../booksData';
import './BookDetail.css';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = getBookById(id);

  if (!book) {
    return (
      <div className="book-detail-page">
        <Navigation />
        <div className="container">
          <div className="book-detail paper-effect">
            <h1>Book not found</h1>
            <button onClick={() => navigate('/')}>Go back home</button>
          </div>
        </div>
      </div>
    );
  }

  const handleAction = (action) => {
    const userStatus = localStorage.getItem('userStatus');
    
    if (userStatus === 'newUser') {
      alert('Please register first to create an account. You will need to pay a small registration fee.');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
      return;
    }

    if (userStatus === 'normalUser') {
      // Navigate to checkout page
      navigate('/checkout');
    } else {
      // If not logged in, redirect to login
      alert('Please login to continue');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    }
  };

  return (
    <div className="book-detail-page">
      <Navigation />
      <div className="container">
        <div className="book-detail paper-effect">
          <div className="book-image">
            <img src={book.coverImage} alt={book.title} />
          </div>
          <div className="book-info">
            <h1>{book.title}</h1>
            <p className="author">By {book.author}</p>
            <div className="book-meta">
              <span>Genre: {book.genre.join(', ')}</span>
              <span>Published: {book.publishedYear}</span>
              <span>Pages: {book.totalPages}</span>
              <span>Language: {book.language}</span>
              <span>Rating: {book.rating}/5</span>
            </div>
            <p className="description">{book.description}</p>
            <div className="reviews">
              <h3>Reviews</h3>
              {book.reviews.map((review, index) => (
                <div key={index} className="review">
                  <p className="review-user">{review.user}</p>
                  <p className="review-rating">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</p>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
            <div className="actions">
              <button className="buy-btn" onClick={() => handleAction('buy')}>Buy</button>
              <button className="rent-btn" onClick={() => handleAction('rent')}>Rent</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail; 