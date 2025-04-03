import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import './BookDetail.css';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - replace with API call
  const book = {
    title: "Book Name",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    coverImage: "https://via.placeholder.com/400x600"
  };

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
            <p className="description">{book.description}</p>
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