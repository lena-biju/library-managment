import React from 'react';
import BookCard from '../BookCard/BookCard';
import './BookGrid.css';

const BookGrid = ({ books }) => {
  return (
    <div className="book-grid">
      {books.map((book, index) => (
        <BookCard key={book.id || index} book={book} />
      ))}
    </div>
  );
};

export default BookGrid; 