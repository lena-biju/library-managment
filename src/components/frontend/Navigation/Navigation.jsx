import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import SearchResults from '../Search/SearchResults';
import { getBooks } from '../../../booksData';
import './Navigation.css';
import logo from '../../../assets/logo.svg';

const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userStatus, setUserStatus] = useState('');
  const [userName, setUserName] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      setIsLoggedIn(true);
      setUserStatus(currentUser.status);
      setUserName(currentUser.name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setIsLoggedIn(false);
    setUserStatus('');
    setUserName('');
    navigate('/');
  };

  const handleProfileClick = () => {
    if (userStatus === 'librarian') {
      navigate('/librarian-dashboard');
    } else {
      navigate('/account');
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    setSearchQuery('');
    setSearchResults([]);
    if (!showSearch && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      const books = getBooks();
      const filtered = books.filter(book => {
        const searchTerm = query.toLowerCase();
        const titleMatch = book.title?.toLowerCase().includes(searchTerm) || false;
        const authorMatch = book.author?.name?.toLowerCase().includes(searchTerm) || false;
        const categoryMatch = book.category?.toLowerCase().includes(searchTerm) || false;
        
        return titleMatch || authorMatch || categoryMatch;
      });
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
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
            
          </div>
        </div>
        <div className="dropdown">
          <button className="dropbtn">E-Books ▼</button>
          <div className="dropdown-content">
            <Link to="/e-books">All E-Books</Link>
            
          </div>
        </div>
      </div>

      <div className="nav-right">
        <div className="search-container">
          <button className="search-toggle" onClick={toggleSearch}>
            {showSearch ? <FaTimes /> : <FaSearch />}
          </button>
          {showSearch && (
            <div className="search-input-container">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search books by title, author, or category..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
          )}
        </div>
        {isLoggedIn ? (
          <div className="user-menu">
            <button className="profile-btn" onClick={handleProfileClick}>
              {userStatus === 'librarian' ? 'Library Admin' : userName}
            </button>
            {userStatus === 'librarian' && (
              <button className="dashboard-btn" onClick={() => navigate('/librarian-dashboard')}>
                Dashboard
              </button>
            )}
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="login-btn">Login</Link>
          </div>
        )}
      </div>

      <SearchResults
        results={searchResults}
        isVisible={showSearch && searchResults.length > 0}
        onClose={toggleSearch}
      />
    </nav>
  );
};

export default Navigation; 