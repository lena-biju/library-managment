import React from 'react';
import { Link } from 'react-router-dom';
import './BookCard.css';

const BookCard = ({ book }) => {
  const {
    id,
    title,
    description,
    coverImage
  } = book;
  console.log('book',book)

  return (
    <div className="book-card">
      <img src={coverImage} alt={title} className="book-cover" />
      <div className="book-info">
        <h3 className="book-title">{title}</h3>
        <p className="book-description">{description}</p>
        <Link to={`/book/${id}`} className="read-more">
          <i className="fas fa-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
};

export default BookCard; 