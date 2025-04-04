import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css';
import logo from '../../../assets/logo.svg';

const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userStatus, setUserStatus] = useState('');
  const [userName, setUserName] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    const status = localStorage.getItem('userStatus');
    if (user) {
      setIsLoggedIn(true);
      setUserStatus(status);
      const userData = JSON.parse(user);
      setUserName(userData.name || 'User');
    } else {
      setIsLoggedIn(false);
      setUserStatus('');
    }

    // Add click outside listener
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Live search functionality
    const performSearch = async () => {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        return;
      }

      try {
        const response = await fetch('/assets/books.json');
        const data = await response.json();
        const filteredBooks = data.books.filter(book => 
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.name.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5); // Limit to 5 results

        setSearchResults(filteredBooks);
      } catch (error) {
        console.error('Error searching books:', error);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userStatus');
    setIsLoggedIn(false);
    setUserStatus('');
    navigate('/');
  };

  const handleProfileClick = () => {
    if (userStatus === 'librarian') {
      navigate('/librarian-dashboard');
    } else {
      navigate('/account');
    }
  };

  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) searchInput.focus();
      }, 100);
    }
  };

  const handleSearchSelect = (bookId) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(`/books/${bookId}`);
  };

  return (
    <nav className="navigation">
      <div className="nav-left">
        <Link to="/" className="nav-logo">
          <img src={logo} alt="ByteBooks Logo" className="logo-image" />
          <span>BYTEBOOKS</span>
        </Link>
      </div>
      
      <div className="nav-center">
        <Link to="/" className="nav-link">Home</Link>
        <div className="dropdown">
          <button className="dropbtn">Books ▼</button>
          <div className="dropdown-content">
            <Link to="/books">All Books</Link>
            <Link to="/category/fiction">Fiction</Link>
            <Link to="/category/non-fiction">Non-Fiction</Link>
            <Link to="/category/science">Science</Link>
            <Link to="/category/technology">Technology</Link>
          </div>
        </div>
        <div className="dropdown">
          <button className="dropbtn">E-Books ▼</button>
          <div className="dropdown-content">
            <Link to="/e-books">All E-Books</Link>
            <Link to="/category/fiction?type=digital">Fiction</Link>
            <Link to="/category/non-fiction?type=digital">Non-Fiction</Link>
            <Link to="/category/science?type=digital">Science</Link>
            <Link to="/category/technology?type=digital">Technology</Link>
          </div>
        </div>
        <Link to="/pricing">Pricing</Link>
      </div>

      <div className="nav-right">
        <div className="search-container" ref={searchRef}>
          <button 
            className={`search-button ${isSearchOpen ? 'active' : ''}`}
            onClick={handleSearchClick}
          >
            <i className="fas fa-search"></i>
          </button>
          {isSearchOpen && (
            <div className="search-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map((book) => (
                    <div
                      key={book.id}
                      className="search-result-item"
                      onClick={() => handleSearchSelect(book.id)}
                    >
                      <img 
                        src={`/${book.cover_image}`}
                        alt={book.title}
                        className="search-result-image"
                        onError={(e) => {
                          console.error(`Error loading image: ${book.cover_image}`);
                          e.target.onerror = null;
                          // Try alternative path
                          const altPath = book.cover_image.replace('assets/', '');
                          e.target.src = `/${altPath}`;
                          // If alternative path fails, use placeholder
                          e.target.onerror = () => {
                            e.target.src = '/assets/images/book-placeholder.jpg';
                          };
                        }}
                      />
                      <div className="search-result-info">
                        <div className="search-result-title">{book.title}</div>
                        <div className="search-result-author">{book.author.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {isLoggedIn ? (
          <div className="user-menu">
            <button className="profile-btn" onClick={handleProfileClick}>
              {userStatus === 'librarian' ? 'Library Admin' : userName}
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/signup" className="signup-btn">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation; 