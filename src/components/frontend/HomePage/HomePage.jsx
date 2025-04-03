import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import './HomePage.css';

const HomePage = () => {
  const categories = ['ADVENTURE', 'ROMANCE', 'BIOPIC', 'POEM', 'SCI-FI', '18+', 'FANTASY', 'HORROR'];

  const featuredBooks = [
    {
      id: 1,
      title: 'ALONE',
      coverImage: '/images/books/alone.jpg',
      category: 'ADVENTURE'
    },
    {
      id: 2,
      title: "DON'T GO THERE",
      coverImage: '/images/books/dont-go-there.jpg',
      category: 'HORROR'
    },
    {
      id: 3,
      title: 'THE MARTIAN',
      coverImage: '/images/books/the-martian.jpg',
      category: 'SCI-FI'
    },
    {
      id: 4,
      title: 'DEEP NIGHT',
      coverImage: '/images/books/deep-night.jpg',
      category: 'HORROR'
    },
    {
      id: 5,
      title: 'AFRICA RISEN',
      coverImage: '/images/books/africa-risen.jpg',
      category: 'FANTASY'
    }
  ];

  const bookCards = Array(12).fill(null).map((_, index) => ({
    id: index + 10,
    title: 'Book Name',
    description: 'Description',
  }));

  const recommendedBooks = [
    {
      id: 6,
      title: 'SENTINEL',
      coverImage: '/images/books/sentinel.jpg',
    },
    {
      id: 7,
      title: 'HARRY POTTER',
      coverImage: '/images/books/harry-potter.jpg',
    },
    {
      id: 8,
      title: 'SWAMI',
      coverImage: '/images/books/swami.jpg',
    },
    {
      id: 9,
      title: 'THE HUNTING GROUND',
      coverImage: '/images/books/hunting-ground.jpg',
    }
  ];

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
          {bookCards.map(book => (
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

        <section className="recommended-section">
          <div className="recommended-books">
            {recommendedBooks.map(book => (
              <Link to={`/book/${book.id}`} key={book.id} className="recommended-book-card">
                <img src={book.coverImage} alt={book.title} />
              </Link>
            ))}
          </div>
          <div className="recommended-content">
            <div className="stars-decoration">
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
            </div>
            <h2>Find Your Favorite Books Here</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <button className="learn-more-btn">
              Learn More <span className="arrow">→</span>
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage; 