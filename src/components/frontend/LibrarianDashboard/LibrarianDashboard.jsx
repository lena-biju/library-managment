import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import BookEditModal from './BookEditModal';
import AboutEditor from './AboutEditor';
import './LibrarianDashboard.css';

const LibrarianDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(() => {
    // Get the active tab from localStorage or default to 'books'
    const savedTab = localStorage.getItem('dashboardActiveTab');
    // Clear the saved tab after reading it
    localStorage.removeItem('dashboardActiveTab');
    return savedTab || 'books';
  });
  const [books, setBooks] = useState([]);
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

  // Data loading functions
  const loadBooks = () => {
    const savedBooks = JSON.parse(localStorage.getItem('books') || '[]');
    setBooks(savedBooks);
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

  const handleBookSave = (updatedBook) => {
    let updatedBooks;
    if (updatedBook.id) {
      updatedBooks = books.map(book => 
        book.id === updatedBook.id ? updatedBook : book
      );
    } else {
      updatedBook.id = Date.now().toString();
      updatedBooks = [...books, updatedBook];
    }
    
    localStorage.setItem('books', JSON.stringify(updatedBooks));
    setBooks(updatedBooks);
    setSelectedBook(null);
    setIsEditing(false);
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

  const renderContent = () => {
    switch (activeTab) {
      case 'books':
        return (
          <div className="books-management">
            <div className="section-header">
              <h2>Books Management</h2>
              <button className="add-btn" onClick={() => setSelectedBook({})}>
                Add New Book
              </button>
            </div>
            
            <div className="books-grid">
              {books.map(book => (
                <div key={book.id} className="book-card">
                  <img src={book.cover_image} alt={book.title} />
                  <div className="book-info">
                    <h3>{book.title}</h3>
                    <p>{book.author.name}</p>
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
              ))}
            </div>

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