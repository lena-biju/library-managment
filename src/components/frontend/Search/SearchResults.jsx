import React from 'react';
import { Link } from 'react-router-dom';
import './SearchResults.css';

const SearchResults = ({ results, isVisible, onClose }) => {
  if (!isVisible || results.length === 0) return null;

  return (
    <div className="search-results-container">
      <div className="search-results">
        <div className="search-results-header">
          <h3>Search Results</h3>
          <button className="close-search" onClick={onClose}>×</button>
        </div>
        <div className="results-list">
          {results.map((book) => (
            <Link 
              to={`/book/${book.id}`} 
              key={book.id} 
              className="result-item"
              onClick={onClose}
            >
              <img 
                src={book.coverImage} 
                alt={book.title} 
                className="result-thumbnail"
              />
              <div className="result-details">
                <h4>{book.title}</h4>
                <p className="author">by {book.author.name}</p>
                <p className="category">{book.category}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResults; 