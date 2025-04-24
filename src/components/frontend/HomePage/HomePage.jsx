import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';
import heroBackground from '../../../assets/images/hero-bg.jpg';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [monthlyBooks, setMonthlyBooks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('currentUser');
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (loggedIn && userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Import and process books.json to get highest rated books
    const fetchHighestRatedBooks = async () => {
      try {
        const booksData = await import('../../../assets/books.json');
        const sortedBooks = booksData.books
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3)
          .map(book => ({
            id: book.id,
            title: book.title,
            author: book.author.name,
            image: book.cover_image,
            rating: book.rating
          }));
        setMonthlyBooks(sortedBooks);
      } catch (error) {
        console.error('Error loading books:', error);
      }
    };

    fetchHighestRatedBooks();
  }, []);

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const stats = [
    { number: '450', text: 'Customers in 2019' },
    { number: '27,000', text: 'Books delivered' },
    { number: '100+', text: 'Bestsellers' },
    { number: '20', text: 'Events held' }
  ];

  const plans = [
    {
      name: 'Normal',
      price: '$5',
      features: [
        'Borrow up to 3 books',
        '20-day return period',
        'Book return alerts',
        'Basic support'
      ]
    },
    {
      name: 'Premium',
      price: '$10',
      features: [
        'Unlimited book purchases',
        '45-day return period',
        'Priority book access',
        'Premium support'
      ]
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Jane Collston',
      text: 'I love to read, but lately, I have had very little time. I couldnt even go to the bookstore. In addition, I do not know at all what everyone is reading now and what books are worth reading. This service helped me get back to reading, now I read 5 books a month and look forward to a new box!',
      date: 'November 05, 2024'
    },
    {
      id: 2,
      name: 'Jeff Marguel',
      text: 'This service gives me the opportunity to always read new books and get acquainted with promising authors even before people start shouting at all cross-roads about them. Thanks to Bookshelf for my wonderful evenings with a new book and a glass of wine! I will continue using the subscription!',
      date: 'March 02, 2024'
    },
    {
      id: 3,
      name: 'Sarah Mitchell',
      text: 'ByteBooks has transformed my reading experience! The convenience of having books delivered to my doorstep combined with their excellent recommendations has helped me discover so many amazing authors. Their customer service is exceptional, and the monthly subscription is worth every penny.',
      date: 'April 15, 2024'
    },
    {
      id: 4,
      name: 'Michael Chen',
      text: 'As a busy professional, finding time to visit bookstores was always a challenge. ByteBooks solved that problem perfectly. Their selection is outstanding, and the mobile app makes it incredibly easy to manage my reading list. The premium membership benefits are fantastic!',
      date: 'January 20, 2024'
    }
  ];

  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const handleTestimonialChange = (index) => {
    setCurrentTestimonialIndex(index);
  };

  const handleNextTestimonial = () => {
    setCurrentTestimonialIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevTestimonial = () => {
    setCurrentTestimonialIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  // Calculate the visible testimonials array with duplicates for infinite scroll
  const getVisibleTestimonials = () => {
    // Create a circular array by duplicating testimonials
    return [...testimonials, ...testimonials, ...testimonials];
  };

  // Calculate the transform offset for centering
  const calculateTransform = () => {
    const baseIndex = currentTestimonialIndex + testimonials.length;
    const cardWidth = 400; // Width of each card
    const gap = 32; // 2rem gap between cards
    return `translateX(calc(-${baseIndex * (cardWidth + gap)}px + 50% - ${cardWidth/2}px))`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handleNextTestimonial();
    }, 20000); // Change testimonial every 20 seconds

    return () => clearInterval(timer);
  }, []);

  const heroStyle = {
    '--hero-background': `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroBackground})`
  };

  return (
    <div className="home-page">
      <Navigation />
      
      {/* Hero Section */}
      <section className="hero-section" style={heroStyle}>
        <div className="hero-content">
          {isLoggedIn && currentUser ? (
            <>
              <h1>Welcome {currentUser.name}!</h1>
              <p>Find all your favourite books here!</p>
              {currentUser.library && (
                <div className="user-stats">
                  <p>Books in your library: {currentUser.library.purchased?.length + currentUser.library.borrowed?.length}</p>
                  <p>Books in wishlist: {currentUser.library.wishlist?.length}</p>
                </div>
              )}
            </>
          ) : (
            <>
              <h1>The Library in your pocket.</h1>
              <p>Find all your favourite books here!</p>
              <button onClick={handleGetStarted} className="get-started-btn">
                Get Started
              </button>
            </>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <h2>{stat.number}</h2>
              <p>{stat.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-image">
            <img src="/assets/images/book-stack.jpg" alt="Stack of books" />
          </div>
          <div className="about-content">
            <h2>About ByteBooks</h2>
            <p className="tagline">We make books great again. Just kidding, books were always great!</p>
            <p className="description">
              Welcome to ByteBooks, where stories come to life at your convenience! Whether you want to buy, rent, or borrow, we've got a collection that spans genres, eras, and cultures. From bestsellers to hidden gems, you'll find books that inspire, entertain, and challenge your perspective. No waiting lists, no dusty shelves—just a seamless way to pick up your next great read. Your next favorite book is just a click away!
            </p>
          </div>
        </div>
      </section>

      {/* Monthly Books Section */}
      <section className="monthly-books-section">
        <h2>Books of the Month</h2>
        <p>Discover our most loved books, rated highly by our community of readers!</p>
        <div className="books-slider">
          {monthlyBooks.map((book) => (
            <div key={book.id} className="book-card">
              <img 
                src={`/${book.image}`}
                alt={book.title} 
                style={{ maxWidth: '100%', height: 'auto', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/images/book-placeholder.jpg';
                }}
              />
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <div className="book-rating">
                <span>★</span> {book.rating.toFixed(1)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <h2>Choose Your Plan</h2>
        <p>Select the perfect plan for your reading journey</p>
        <div className="pricing-container">
          {plans.map((plan, index) => (
            <div key={index} className="pricing-card paper-effect">
              <h3>{plan.name}</h3>
              <div className="price">{plan.price}<span>/month</span></div>
              <ul className="features">
                {plan.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
              <button 
                className="signup-btn" 
                onClick={() => isLoggedIn ? navigate('/subscription') : navigate('/signup')}
              >
                {isLoggedIn ? 'Subscribe Now' : 'Sign Up'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Our Store Section */}
      <section className="store-section">
        <h2>Our Store</h2>
        <div className="divider"></div>
        <p className="store-description">
          Want to find a cozy corner in a big city? Come to our bookstore in New York and spend time
          with a book in a light insta-friendly space.
        </p>
        <div className="store-gallery">
          <div className="gallery-grid">
            <div className="gallery-item large">
              <img src="/assets/images/tea cup on book.jpg" alt="Kinfolk magazine and notebook display" />
            </div>
            <div className="gallery-item">
              <img src="/assets/images/redaing.jpg" alt="Book layout and design" />
            </div>
            <div className="gallery-item">
              <img src="/assets/images/plantspace.jpg" alt="Plant and reading space" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>Testimonials</h2>
        <p className="section-subtitle">Read reviews from other book lovers.</p>
        <div className="testimonials-slider">
          <button 
            className="nav-button prev" 
            onClick={handlePrevTestimonial}
            aria-label="Previous testimonial"
          >
            ‹
          </button>
          <div className="testimonials-viewport">
            <div 
              className="testimonials-track"
              style={{
                transform: calculateTransform(),
              }}
            >
              {getVisibleTestimonials().map((testimonial, index) => (
                <div 
                  key={`${testimonial.id}-${index}`}
                  className={`testimonial-card ${index === currentTestimonialIndex + testimonials.length ? 'active' : ''}`}
                >
                  <div className="testimonial-content">
                    <div className="testimonial-number">{(index % testimonials.length) + 1}</div>
                    <h3 className="testimonial-name">{testimonial.name}</h3>
                    <p className="testimonial-role">{testimonial.role || 'Project Manager'}</p>
                    <p className="testimonial-text">{testimonial.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button 
            className="nav-button next" 
            onClick={handleNextTestimonial}
            aria-label="Next testimonial"
          >
            ›
          </button>
          <div className="testimonial-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentTestimonialIndex ? 'active' : ''}`}
                onClick={() => handleTestimonialChange(index)}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="quote-section">
        <div className="quote-container">
          <div className="quote-content">
            <div className="quote-mark">❝</div>
            <blockquote>
              <p>You think your pain and your heartbreak are unprecedented in the history of the world, but then you read.</p>
              <p>It was books that taught me that the things that tormented me most were the very things that connected me with all the people who were alive, who had ever been alive.</p>
            </blockquote>
            <cite>James Baldwin</cite>
          </div>
          <div className="quote-image">
            <img src="/assets/images/man.jpg" alt="Book with coffee and magazine" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage; 