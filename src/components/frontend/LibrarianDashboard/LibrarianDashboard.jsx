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
  const [testimonialPage, setTestimonialPage] = useState(0);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', text: '', date: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({ name: '', text: '', date: '' });

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

  // Add these at the top level of the component, after other handlers
  const handleTransactionEdit = (transaction) => {
    alert('Edit transaction feature not implemented yet.');
  };
  const handleTransactionDelete = (transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const updatedTransactions = transactions.filter(t => t.id !== transactionId);
      setTransactions(updatedTransactions);
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    }
  };

  // Add this after testimonials state initialization
  useEffect(() => {
    if (!localStorage.getItem('testimonials') || JSON.parse(localStorage.getItem('testimonials')).length === 0) {
      const defaultTestimonials = [
        {
          id: 1,
          name: 'Jane Collston',
          text: 'I love to read, but lately, I have had very little time. I couldnt even go to the bookstore. In addition, I do not know at all what everyone is reading now and what books are worth reading. This service helped me get back to reading, now I read 5 books a month and look forward to a new box!',
          date: 'November 05, 2024',
          role: 'Project Manager',
          rating: 5
        },
        {
          id: 2,
          name: 'Jeff Marguel',
          text: 'This service gives me the opportunity to always read new books and get acquainted with promising authors even before people start shouting at all cross-roads about them. Thanks to Bookshelf for my wonderful evenings with a new book and a glass of wine! I will continue using the subscription!',
          date: 'March 02, 2024',
          role: 'Project Manager',
          rating: 5
        },
        {
          id: 3,
          name: 'Sarah Mitchell',
          text: 'ByteBooks has transformed my reading experience! The convenience of having books delivered to my doorstep combined with their excellent recommendations has helped me discover so many amazing authors. Their customer service is exceptional, and the monthly subscription is worth every penny.',
          date: 'April 15, 2024',
          role: 'Project Manager',
          rating: 5
        },
        {
          id: 4,
          name: 'Michael Chen',
          text: 'As a busy professional, finding time to visit bookstores was always a challenge. ByteBooks solved that problem perfectly. Their selection is outstanding, and the mobile app makes it incredibly easy to manage my reading list. The premium membership benefits are fantastic!',
          date: 'January 20, 2024',
          role: 'Project Manager',
          rating: 5
        }
      ];
      localStorage.setItem('testimonials', JSON.stringify(defaultTestimonials));
      setTestimonials(defaultTestimonials);
    }
  }, []);

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
      case 'testimonials':
        // Carousel logic
        const testimonialsPerPage = 4;
        const paginatedTestimonials = testimonials.slice(testimonialPage * testimonialsPerPage, (testimonialPage + 1) * testimonialsPerPage);
        const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);

        const handleNextPage = () => {
          setTestimonialPage((prev) => (prev + 1) % totalPages);
        };
        const handlePrevPage = () => {
          setTestimonialPage((prev) => (prev - 1 + totalPages) % totalPages);
        };

        const startEdit = (testimonial) => {
          setEditingTestimonial(testimonial.id);
          setEditForm({ name: testimonial.name, text: testimonial.text, date: testimonial.date });
        };
        const cancelEdit = () => {
          setEditingTestimonial(null);
          setEditForm({ name: '', text: '', date: '' });
        };
        const saveEdit = (id) => {
          const updated = testimonials.map(t => t.id === id ? { ...t, ...editForm } : t);
          setTestimonials(updated);
          localStorage.setItem('testimonials', JSON.stringify(updated));
          setEditingTestimonial(null);
        };

        return (
          <div className="testimonials-management">
            <div className="section-header">
              <h2>Manage Testimonials</h2>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={handlePrevPage}>&lt;</button>
                <button onClick={handleNextPage}>&gt;</button>
                <button onClick={() => setShowAddForm(true)} style={{ marginLeft: '2rem', background: '#8B4513', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', cursor: 'pointer' }}>+ Add Testimonial</button>
              </div>
            </div>
            {showAddForm && (
              <div style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '2rem', margin: '1rem 0', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
                <h3 style={{ fontFamily: 'inherit', fontWeight: 700, fontSize: '1.3rem', marginBottom: '1rem' }}>Add New Testimonial</h3>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.3rem', color: '#6B3410', fontWeight: 500 }}>Name</label>
                  <input
                    type="text"
                    value={newTestimonial.name}
                    onChange={e => setNewTestimonial(f => ({ ...f, name: e.target.value }))}
                    placeholder="Name"
                    style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem', borderRadius: '5px', border: '1px solid #E6D5C3' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.3rem', color: '#6B3410', fontWeight: 500 }}>Testimonial</label>
                  <textarea
                    value={newTestimonial.text}
                    onChange={e => setNewTestimonial(f => ({ ...f, text: e.target.value }))}
                    placeholder="Testimonial"
                    style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem', borderRadius: '5px', border: '1px solid #E6D5C3', minHeight: '80px' }}
                  />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.3rem', color: '#6B3410', fontWeight: 500 }}>Date</label>
                  <input
                    type="text"
                    value={newTestimonial.date}
                    onChange={e => setNewTestimonial(f => ({ ...f, date: e.target.value }))}
                    placeholder="Date"
                    style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem', borderRadius: '5px', border: '1px solid #E6D5C3' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button style={{ background: '#8B4513', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem 1.5rem', cursor: 'pointer', fontWeight: 600 }} onClick={() => {
                    if (!newTestimonial.name || !newTestimonial.text || !newTestimonial.date) return;
                    const newId = Date.now();
                    const toAdd = { ...newTestimonial, id: newId };
                    const updated = [...testimonials, toAdd];
                    setTestimonials(updated);
                    localStorage.setItem('testimonials', JSON.stringify(updated));
                    setShowAddForm(false);
                    setNewTestimonial({ name: '', text: '', date: '' });
                  }}>Add</button>
                  <button style={{ background: '#aaa', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem 1.5rem', cursor: 'pointer', fontWeight: 600 }} onClick={() => {
                    setShowAddForm(false);
                    setNewTestimonial({ name: '', text: '', date: '' });
                  }}>Cancel</button>
                </div>
              </div>
            )}
            <div className="testimonials-carousel-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '1.5rem', maxWidth: 800 }}>
              {paginatedTestimonials.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#888' }}>No testimonials found. Click "+ Add Testimonial" to add one.</div>
              ) : (
                paginatedTestimonials.map((testimonial) => (
                  <div key={testimonial.id || 'new'} className="testimonial-card paper-effect" style={{ padding: '1.5rem', position: 'relative', background: '#fff', color: '#4A2B0F', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', opacity: 1, margin: '0.5rem 0' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{testimonial.name}</h3>
                    <p style={{ fontStyle: 'italic', color: '#6B3410', marginBottom: '0.5rem' }}>{testimonial.text}</p>
                    <div style={{ fontSize: '0.95em', color: '#888', marginBottom: '0.5rem' }}>{testimonial.date}</div>
                    <div style={{ display: 'flex', gap: '0.5rem', position: 'absolute', top: 8, right: 8 }}>
                      <button style={{ background: '#DC3545', color: 'white', border: 'none', borderRadius: '4px', padding: '0.3rem 0.7rem', cursor: 'pointer' }} onClick={() => {
                        setTestimonials(prevTestimonials => {
                          const updated = prevTestimonials.filter(t => String(t.id) !== String(testimonial.id));
                          localStorage.setItem('testimonials', JSON.stringify(updated));
                          return updated;
                        });
                      }}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              Page {testimonialPage + 1} of {totalPages}
            </div>
          </div>
        );
      case 'subscriptions':
        return (
          <div className="subscriptions-management">
            <div className="section-header">
              <h2>Subscription Plans</h2>
            </div>
            <div className="subscriptions-table">
              <table>
                <thead>
                  <tr>
                    <th>Plan Name</th>
                    <th>Duration</th>
                    <th>Discount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptionPlans.map(plan => (
                    <tr key={plan.id}>
                      <td>{plan.name}</td>
                      <td>{plan.duration} months</td>
                      <td>{plan.discount}%</td>
                      <td>
                        <button onClick={() => handlePlanEdit(plan)}>Edit</button>
                        <button 
                          className="delete-btn"
                          onClick={() => handlePlanDelete(plan.id)}
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
      case 'transactions':
        return (
          <div className="transactions-management">
            <div className="section-header">
              <h2>Transactions</h2>
            </div>
            <div className="transactions-table">
              <table>
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Book Title</th>
                    <th>User</th>
                    <th>Transaction Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(transaction => (
                    <tr key={transaction.id}>
                      <td>{transaction.id}</td>
                      <td>{transaction.book.title}</td>
                      <td>{transaction.user.name}</td>
                      <td>{transaction.transaction_date}</td>
                      <td>
                        <button onClick={() => handleTransactionEdit(transaction)}>Edit</button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleTransactionDelete(transaction.id)}
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