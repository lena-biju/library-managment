import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import BookEditModal from './BookEditModal';
import AboutEditor from './AboutEditor';
import AddBookForm from './AddBookForm';
import './LibrarianDashboard.css';

const LibrarianDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('books');
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [aboutContent, setAboutContent] = useState(() => {
    const savedContent = localStorage.getItem('aboutContent');
    return savedContent ? JSON.parse(savedContent) : {
      title: 'About Our Library',
      subtitle: 'A Community of Book Lovers',
      mission: 'Our mission is to provide accessible knowledge and foster a love for reading in our community.',
      vision: 'We envision a world where everyone has access to the transformative power of books and learning.',
      history: 'Founded in 2020, our library has grown from a small collection to a vibrant community hub.',
      team: [],
      contact: {
        address: '123 Library Street, Booktown, BT 12345',
        phone: '(555) 123-4567',
        email: 'contact@library.com',
        hours: 'Monday-Friday: 9am-8pm\nSaturday: 10am-6pm\nSunday: 12pm-5pm'
      },
      socialLinks: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: ''
      }
    };
  });
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('librarySettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      general: {
        libraryName: 'Community Library',
        contactEmail: 'contact@library.com',
        phoneNumber: '(555) 123-4567'
      },
      notifications: {
        newBooks: true,
        overdueReminders: true,
        subscriptionReminders: true
      },
      system: {
        maxRentalDays: 14,
        lateFeePerDay: 0.50,
        gracePeriod: 2
      }
    };
  });
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if user is librarian
    const userStatus = localStorage.getItem('userStatus');
    if (userStatus !== 'librarian') {
      alert('Access denied. Librarian privileges required.');
      navigate('/login');
      return;
    }

    // Load data
    loadBooks();
    loadTestimonials();
    loadAboutContent();
    loadSubscriptionPlans();
    loadTransactions();
  }, [navigate]);

  useEffect(() => {
    // Filter books based on search query
    const filtered = books.filter(book => {
      const searchLower = searchQuery.toLowerCase();
      return (
        book.title.toLowerCase().includes(searchLower) ||
        book.author.name.toLowerCase().includes(searchLower) ||
        book.isbn.toLowerCase().includes(searchLower) ||
        book.genre.some(g => g.toLowerCase().includes(searchLower))
      );
    });
    setFilteredBooks(filtered);
  }, [searchQuery, books]);

  // Data loading functions
  const loadBooks = () => {
    const savedBooks = JSON.parse(localStorage.getItem('books') || '[]');
    setBooks(savedBooks);
    setFilteredBooks(savedBooks);
  };

  const loadTestimonials = () => {
    const savedTestimonials = JSON.parse(localStorage.getItem('testimonials') || '[]');
    setTestimonials(savedTestimonials);
  };

  const loadAboutContent = () => {
    const savedContent = JSON.parse(localStorage.getItem('aboutContent') || '{}');
    setAboutContent(savedContent);
  };

  const loadSubscriptionPlans = () => {
    const savedPlans = JSON.parse(localStorage.getItem('subscriptionPlans') || '[]');
    setSubscriptionPlans(savedPlans);
  };

  const loadTransactions = () => {
    const savedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    setTransactions(savedTransactions);
  };

  // Book management handlers
  const handleBookEdit = (book) => {
    setSelectedBook(book);
    setIsEditing(true);
  };

  const handleBookSave = async (updatedBookData) => {
    try {
      // Get existing books from the API
      const response = await fetch('http://localhost:3001/api/books');
      const data = await response.json();
      const existingBooks = data.books;

      let updatedBooks;
      if (updatedBookData.id) {
        // Update existing book
        updatedBooks = existingBooks.map(book => 
          book.id === updatedBookData.id ? { ...book, ...updatedBookData } : book
        );
      } else {
        // This shouldn't happen as new books are handled by handleSaveBook
        return;
      }

      // Sort books by ID
      updatedBooks.sort((a, b) => a.id - b.id);

      // Update metadata
      const updatedData = {
        books: updatedBooks,
        metadata: {
          total_books: updatedBooks.length,
          last_updated: new Date().toISOString().split('T')[0],
          version: "1.0"
        }
      };

      // Save to books.json via API
      const saveResponse = await fetch('http://localhost:3001/api/books/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save books');
      }

      // Update localStorage
      localStorage.setItem('books', JSON.stringify(updatedBooks));
      
      // Update state
      setBooks(updatedBooks);
      setSelectedBook(null);
      setIsEditing(false);

      // Show success message
      alert('Book updated successfully!');

    } catch (error) {
      console.error('Error updating book:', error);
      alert('Failed to update book. Please try again.');
    }
  };

  const handleBookDelete = (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      const updatedBooks = books.filter(book => book.id !== bookId);
      localStorage.setItem('books', JSON.stringify(updatedBooks));
      setBooks(updatedBooks);
    }
  };

  // User management handlers
  const handleUserEdit = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
  };

  const handleUserSave = (updatedUser) => {
    let updatedUsers;
    if (updatedUser.id) {
      updatedUsers = users.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      );
    } else {
      updatedUser.id = Date.now().toString();
      updatedUsers = [...users, updatedUser];
    }
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setSelectedUser(null);
    setIsEditing(false);
  };

  const handleUserDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
    }
  };

  // Testimonial management handlers
  const handleTestimonialEdit = (testimonial) => {
    // To be implemented
  };

  const handleTestimonialSave = (updatedTestimonial) => {
    // To be implemented
  };

  const handleTestimonialDelete = (testimonialId) => {
    // To be implemented
  };

  // Subscription plan management handlers
  const handlePlanEdit = (plan) => {
    // To be implemented
  };

  const handlePlanSave = (updatedPlan) => {
    // To be implemented
  };

  const handlePlanDelete = (planId) => {
    // To be implemented
  };

  const handleSaveAboutContent = (newContent) => {
    setAboutContent(newContent);
    localStorage.setItem('aboutContent', JSON.stringify(newContent));
    alert('About page content saved successfully!');
  };

  const handleSettingChange = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleSettingsSave = () => {
    localStorage.setItem('librarySettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddNewBook = () => {
    setIsAddingBook(true);
  };

  const handleSaveBook = async (newBookData) => {
    try {
      console.log('Attempting to save new book:', newBookData);

      // Fetch current books from API
      const response = await fetch('http://localhost:3001/api/books');
      if (!response.ok) {
        throw new Error(`Failed to fetch existing books: ${response.statusText}`);
      }
      const data = await response.json();
      const existingBooks = data.books || [];

      console.log('Fetched existing books:', existingBooks);

      // Find highest ID and increment
      const maxId = existingBooks.length > 0 
        ? Math.max(...existingBooks.map(book => parseInt(book.id)))
        : 0;
      const newId = (maxId + 1).toString();

      // Create new book object with proper structure
      const newBook = {
        id: newId,
        title: newBookData.title,
        author: newBookData.author,
        isbn: newBookData.isbn,
        genre: newBookData.genre || 'Uncategorized',
        language: newBookData.language || 'English',
        published_year: newBookData.published_year || new Date().getFullYear().toString(),
        cover_image: newBookData.cover_image || `books/covers/default-cover.jpg`,
        author_image: newBookData.author_image || `books/authors/default-author.jpg`,
        description: newBookData.description || '',
        bio: newBookData.bio || '',
        review: newBookData.review || '',
        category: newBookData.category || 'General',
        file_path: `books/text/${newId}-${newBookData.title.toLowerCase().replace(/\s+/g, '-')}.pdf`
      };

      // Add new book to existing books
      const updatedBooks = [...existingBooks, newBook].sort((a, b) => parseInt(a.id) - parseInt(b.id));

      // Prepare data for API
      const updatedData = {
        books: updatedBooks,
        metadata: {
          total_books: updatedBooks.length,
          last_updated: new Date().toISOString().split('T')[0],
          version: "1.0"
        }
      };

      console.log('Sending updated data to API:', updatedData);

      // Save to API
      const saveResponse = await fetch('http://localhost:3001/api/books/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(`Server error: ${errorData.error || saveResponse.statusText}`);
      }

      // Update local storage
      localStorage.setItem('books', JSON.stringify(updatedBooks));
      
      // Show success message
      alert('Book added successfully!');
      
      // Refresh books list
      setBooks(updatedBooks);
    } catch (error) {
      console.error('Error saving book:', error);
      alert(`Failed to add book: ${error.message}`);
    }
  };

  const handleCancelAdd = () => {
    setIsAddingBook(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'books':
        return (
          <div className="books-management">
            <div className="section-header">
              <h2>Books Management</h2>
              <div className="header-actions">
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Search books by title, author, ISBN, or genre..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search-input"
                  />
                </div>
                <button className="add-btn" onClick={handleAddNewBook}>
                  Add New Book
                </button>
              </div>
            </div>
            
            {isAddingBook ? (
              <AddBookForm 
                onSave={handleSaveBook}
                onCancel={handleCancelAdd}
              />
            ) : (
              <div className="books-grid">
                {filteredBooks.length === 0 ? (
                  <div className="no-results">
                    No books found matching your search criteria
                  </div>
                ) : (
                  filteredBooks.map(book => (
                    <div key={book.id} className="book-card">
                      <img
                        src={book.cover_image || '/default-book-cover.jpg'}
                        alt={book.title}
                        className="book-cover"
                      />
                      <div className="book-info">
                        <h3>{book.title}</h3>
                        <p className="author">by {book.author.name}</p>
                        <div className="book-type-tags">
                          <span className={`type-tag ${book.category?.includes('ebook') ? 'ebook' : 'offline'}`}>
                            {book.category?.includes('ebook') ? 'E-Book' : 'Physical Book'}
                          </span>
                        </div>
                        <p className="isbn">ISBN: {book.isbn}</p>
                        <p className="genre">{book.genre.join(', ')}</p>
                        <div className="book-actions">
                          <button onClick={() => handleBookEdit(book)}>Edit</button>
                          <button 
                            className="delete-btn"
                            onClick={() => handleBookDelete(book.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {selectedBook && (
              <BookEditModal
                book={selectedBook}
                onSave={handleBookSave}
                onClose={() => {
                  setSelectedBook(null);
                  setIsEditing(false);
                }}
              />
            )}
          </div>
        );
      case 'users':
        return (
          <div className="users-management">
            <div className="section-header">
              <h2>Users Management</h2>
            </div>
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.status}</td>
                      <td>
                        <button onClick={() => handleUserEdit(user)}>Edit</button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleUserDelete(user.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'about':
        return (
          <AboutEditor
            content={aboutContent}
            onSave={handleSaveAboutContent}
          />
        );
      case 'settings':
        return (
          <div className="settings-management">
            <div className="section-header">
              <h2>Settings</h2>
            </div>
            <div className="settings-grid">
              <div className="settings-section">
                <h3>General Settings</h3>
                <div className="form-group">
                  <label>Library Name</label>
                  <input
                    type="text"
                    value={settings.general.libraryName}
                    onChange={(e) => handleSettingChange('general', 'libraryName', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Contact Email</label>
                  <input
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(e) => handleSettingChange('general', 'contactEmail', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={settings.general.phoneNumber}
                    onChange={(e) => handleSettingChange('general', 'phoneNumber', e.target.value)}
                  />
                </div>
              </div>
              <div className="settings-section">
                <h3>Email Notifications</h3>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.notifications.newBooks}
                      onChange={(e) => handleSettingChange('notifications', 'newBooks', e.target.checked)}
                    />
                    Send new book notifications
                  </label>
                </div>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.notifications.overdueReminders}
                      onChange={(e) => handleSettingChange('notifications', 'overdueReminders', e.target.checked)}
                    />
                    Send overdue reminders
                  </label>
                </div>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.notifications.subscriptionReminders}
                      onChange={(e) => handleSettingChange('notifications', 'subscriptionReminders', e.target.checked)}
                    />
                    Send subscription renewal reminders
                  </label>
                </div>
              </div>
              <div className="settings-section">
                <h3>System Settings</h3>
                <div className="form-group">
                  <label>Maximum Rental Period (days)</label>
                  <input
                    type="number"
                    value={settings.system.maxRentalDays}
                    onChange={(e) => handleSettingChange('system', 'maxRentalDays', parseInt(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label>Late Fee (per day)</label>
                  <input
                    type="number"
                    value={settings.system.lateFeePerDay}
                    step="0.10"
                    onChange={(e) => handleSettingChange('system', 'lateFeePerDay', parseFloat(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label>Grace Period (days)</label>
                  <input
                    type="number"
                    value={settings.system.gracePeriod}
                    onChange={(e) => handleSettingChange('system', 'gracePeriod', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
            <div className="settings-actions">
              <button className="save-btn" onClick={handleSettingsSave}>
                Save Changes
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="librarian-dashboard">
      <Navigation />
      <div className="dashboard-container">
        <div className="dashboard-sidebar">
          <h2>Library Admin</h2>
          <nav className="dashboard-nav">
            <button 
              className={`nav-item ${activeTab === 'books' ? 'active' : ''}`}
              onClick={() => setActiveTab('books')}
            >
              <i className="fas fa-book"></i>
              Books Management
            </button>
            <button 
              className={`nav-item ${activeTab === 'testimonials' ? 'active' : ''}`}
              onClick={() => setActiveTab('testimonials')}
            >
              <i className="fas fa-quote-right"></i>
              Testimonials
            </button>
            <button 
              className={`nav-item ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              <i className="fas fa-info-circle"></i>
              About Content
            </button>
            <button 
              className={`nav-item ${activeTab === 'subscriptions' ? 'active' : ''}`}
              onClick={() => setActiveTab('subscriptions')}
            >
              <i className="fas fa-tags"></i>
              Subscription Plans
            </button>
            <button 
              className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
              onClick={() => setActiveTab('transactions')}
            >
              <i className="fas fa-exchange-alt"></i>
              Transactions
            </button>
            <button 
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <i className="fas fa-cog"></i>
              Settings
            </button>
          </nav>
        </div>

        <main className="dashboard-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default LibrarianDashboard;