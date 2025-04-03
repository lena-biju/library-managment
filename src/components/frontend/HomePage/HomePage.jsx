import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import { getFeaturedBooks, getAllGenres, getBooks, getBooksByGenre } from '../../../booksData';
import './HomePage.css';

const HomePage = () => {
  const [selectedGenre, setSelectedGenre] = useState('all');
  const categories = ['All Books', ...getAllGenres()];
  const featuredBooks = getFeaturedBooks();
  const allBooks = getBooks();
  
  const displayedBooks = selectedGenre === 'all' 
    ? allBooks.slice(0, 12)
    : getBooksByGenre(selectedGenre).slice(0, 12);

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre === 'All Books' ? 'all' : genre);
  };

  return (
    <div className="home-page">
      <Navigation />
      
      <main className="main-content paper-background">
        <section className="hero-section">
          <h1 className="main-title">LIBRARY IN YOUR POCKET</h1>
          <p className="subtitle">
            FIND ALL YOUR FAVORITES BOOKS HERE.<br />
            READ DREAM BUY
          </p>
        </section>

        <section className="featured-books-section">
          <div className="featured-books-container">
            {featuredBooks.map(book => (
              <Link to={`/book/${book.id}`} key={book.id} className="featured-book-card">
                <img src={book.coverImage} alt={book.title} />
              </Link>
            ))}
          </div>
        </section>

        <section className="categories-bar">
          {categories.map(category => (
            <button 
              key={category} 
              className={`category-btn ${selectedGenre === (category === 'All Books' ? 'all' : category) ? 'active' : ''}`}
              onClick={() => handleGenreClick(category)}
            >
              {category}
            </button>
          ))}
        </section>

        <section className="book-cards-grid">
          {displayedBooks.map(book => (
            <Link to={`/book/${book.id}`} key={book.id} className="book-card paper-effect">
              <div className="book-info">
                <h3>{book.title}</h3>
                <p>{book.description}</p>
              </div>
              <div className="arrow-circle">
                <span className="arrow">→</span>
              </div>
            </Link>
          ))}
          {displayedBooks.length === 0 && (
            <div className="no-books-message">
              No books found in this category
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage; 