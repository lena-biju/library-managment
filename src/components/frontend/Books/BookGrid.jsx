import React from 'react';
import { Link } from 'react-router-dom';
import './BookGrid.css';

const BookGrid = () => {
  const categories = ['ADVENTURE', 'ROMANCE', 'BIOPIC', 'POEM', 'SCI-FI', '18+', 'FANTASY', 'HORROR'];
  
  const featuredBooks = [
    { id: 1, title: 'ALONE', cover: '/books/alone.jpg', category: 'ADVENTURE' },
    { id: 2, title: "DON'T GO THERE", cover: '/books/dont-go-there.jpg', category: 'HORROR' },
    { id: 3, title: 'THE MARTIAN', cover: '/books/the-martian.jpg', category: 'SCI-FI' },
    { id: 4, title: 'DEEP NIGHT', cover: '/books/deep-night.jpg', category: 'HORROR' },
    { id: 5, title: 'AFRICA RISEN', cover: '/books/africa-risen.jpg', category: 'FANTASY' }
  ];

  const recommendedBooks = [
    { id: 6, title: 'SENTINEL', cover: '/books/sentinel.jpg', category: 'SCI-FI' },
    { id: 7, title: 'HARRY POTTER', cover: '/books/harry-potter.jpg', category: 'FANTASY' },
    { id: 8, title: 'SWAMI', cover: '/books/swami.jpg', category: 'BIOPIC' },
    { id: 9, title: 'THE HUNTING GROUND', cover: '/books/hunting-ground.jpg', category: 'HORROR' }
  ];

  return (
    <div className="book-grid-container">
      <h1 className="main-title">LIBRARY IN YOUR POCKET</h1>
      <p className="subtitle">
        FIND ALL YOUR FAVORITES BOOKS HERE.<br />
        READ DREAM BUY
      </p>

      <div className="categories-bar">
        {categories.map((category, index) => (
          <button key={index} className="category-btn">
            {category}
          </button>
        ))}
      </div>

      <div className="featured-books">
        {featuredBooks.map(book => (
          <Link to={`/book/${book.id}`} key={book.id} className="featured-book">
            <img src={book.cover} alt={book.title} />
          </Link>
        ))}
      </div>

      <div className="book-grid">
        {Array(16).fill(null).map((_, index) => (
          <Link to={`/book/${index + 10}`} key={index} className="book-card paper-effect">
            <div className="book-info">
              <h3>Book Name</h3>
              <p>Description</p>
            </div>
            <div className="arrow-icon">→</div>
          </Link>
        ))}
      </div>

      <div className="recommended-section">
        <div className="recommended-books">
          {recommendedBooks.map(book => (
            <Link to={`/book/${book.id}`} key={book.id} className="recommended-book">
              <img src={book.cover} alt={book.title} />
            </Link>
          ))}
        </div>
        <div className="recommended-text">
          <h2>Find Your Favorite Books Here</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <button className="learn-more-btn">Learn More →</button>
        </div>
      </div>
    </div>
  );
};

export default BookGrid; 