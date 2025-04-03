import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import { getFeaturedBooks, getRecommendedBooks, getAllGenres, getBooks } from '../../../booksData';
import './HomePage.css';

const HomePage = () => {
  const categories = getAllGenres();
  const featuredBooks = getFeaturedBooks();
  const recommendedBooks = getRecommendedBooks();
  const allBooks = getBooks();

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
            <button key={category} className="category-btn">
              {category}
            </button>
          ))}
        </section>

        <section className="book-cards-grid">
          {allBooks.slice(0, 12).map(book => (
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
        </section>

        <section className="recommended-books-section">
          <h2>Recommended Books</h2>
          <div className="recommended-books-container">
            {recommendedBooks.map(book => (
              <Link to={`/book/${book.id}`} key={book.id} className="recommended-book-card">
                <img src={book.coverImage} alt={book.title} />
                <h3>{book.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage; 