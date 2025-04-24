import React, { useState, useEffect } from 'react';
import './BookEditModal.css';
import { toast } from 'react-hot-toast';

// Generate a random ISBN-13 number
const generateISBN = () => {
  const prefix = '978';
  const randomPart = Math.floor(Math.random() * 9000000000 + 1000000000);
  const isbn = `${prefix}${randomPart}`;
  return isbn;
};

const BookEditModal = ({ book, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    author: {
      name: '',
      profile_picture: '',
      bio: ''
    },
    cover_image: '',
    description: '',
    genre: [],
    rating: 0,
    reviews: [],
    price: 0,
    rentPrice: 0,
    status: 'available',
    category: []
  });

  const [coverPreview, setCoverPreview] = useState('');
  const [authorImagePreview, setAuthorImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (book) {
      setFormData({
        ...book,
        genre: book.genre || [],
        price: book.price || 29.99,
        rentPrice: book.rentPrice || 9.99,
        category: book.category || []
      });
      setCoverPreview(book.cover_image || '');
      setAuthorImagePreview(book.author?.profile_picture || '');
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('author.')) {
      const authorField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        author: {
          ...prev.author,
          [authorField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleBookTypeChange = (type) => {
    setFormData(prev => {
      const newCategory = [...prev.category];
      const index = newCategory.indexOf(type);
      
      if (index === -1) {
        newCategory.push(type);
      } else {
        newCategory.splice(index, 1);
      }
      
      return {
        ...prev,
        category: newCategory
      };
    });
  };

  const handleImageChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Create unique filename using timestamp and original name
      const timestamp = new Date().getTime();
      const uniqueFilename = `${timestamp}-${file.name.replace(/\s+/g, '-')}`;
      const targetPath = type === 'cover' ? `assets/books/covers/${uniqueFilename}` : `assets/authors/${uniqueFilename}`;

      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        
        if (type === 'cover') {
          setCoverPreview(base64String);
          setFormData(prev => ({
            ...prev,
            cover_image: base64String
          }));

          // Save base64 string to localStorage for persistence
          const books = JSON.parse(localStorage.getItem('books') || '[]');
          if (formData.id) {
            const bookIndex = books.findIndex(b => b.id === formData.id);
            if (bookIndex !== -1) {
              books[bookIndex].cover_image = base64String;
              localStorage.setItem('books', JSON.stringify(books));
            }
          }
        } else {
          setAuthorImagePreview(base64String);
          setFormData(prev => ({
            ...prev,
            author: {
              ...prev.author,
              profile_picture: base64String
            }
          }));
        }
      };
      reader.readAsDataURL(file);

    } catch (error) {
      console.error('Error handling image:', error);
      alert('Failed to upload image. Please try again.');
    }
  };

  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      genre: checked 
        ? [...prev.genre, value]
        : prev.genre.filter(g => g !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get current books
      const response = await fetch('http://localhost:3001/api/books');
      const data = await response.json();
      let books = data.books || [];

      // Create new book object
      const newBook = {
        id: book ? formData.id : String(Math.max(...books.map(b => parseInt(b.id) || 0), 0) + 1),
        title: formData.title,
        author: formData.author,
        isbn: formData.isbn || generateISBN(),
        genre: formData.genre,
        language: formData.language || 'English',
        published_year: formData.published_year || new Date().getFullYear(),
        cover_image: formData.cover_image || `/src/assets/books/covers/default-cover.jpg`,
        description: formData.description || '',
        file_type: formData.category?.includes('ebook') ? 'pdf' : 'physical',
        file_path: formData.category?.includes('ebook') 
          ? `/src/assets/books/text/${formData.id || 'new'}-${formData.title.toLowerCase().replace(/\s+/g, '-')}.pdf`
          : null,
        content: '',
        total_pages: formData.total_pages || '0',
        read_time: formData.read_time || '0',
        rating: formData.rating || '0',
        reviews: [],
        availability: true,
        bookmark: null,
        audio_version: false,
        purchase_link: '',
        category: formData.category || []
      };

      // Update books array
      if (book) {
        books = books.map(b => b.id === formData.id ? newBook : b);
      } else {
        books.push(newBook);
      }

      // Sort books by ID
      books.sort((a, b) => parseInt(a.id) - parseInt(b.id));

      // Prepare data for API
      const updateData = {
        books,
        metadata: {
          total_books: books.length,
          last_updated: new Date().toISOString().split('T')[0],
          version: "1.0"
        }
      };

      // Send update to server
      const updateResponse = await fetch('http://localhost:3001/api/books/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update books');
      }

      // Update local storage
      localStorage.setItem('books', JSON.stringify(books));

      setIsLoading(false);
      onClose();
      toast.success(book ? 'Book updated successfully!' : 'Book added successfully!');
    } catch (error) {
      console.error('Error saving book:', error);
      setIsLoading(false);
      toast.error('Failed to save book. Please try again.');
    }
  };

  const genres = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Science Fiction',
    'Fantasy', 'Romance', 'Thriller', 'Horror', 'Biography',
    'History', 'Philosophy', 'Politics', 'Science', 'Technology'
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{book?.id ? 'Edit Book' : 'Add New Book'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-grid">
            <div className="form-section">
              <h3>Book Details</h3>
              
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Book Type</label>
                <div className="book-type-checkboxes">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.category.includes('ebook')}
                      onChange={() => handleBookTypeChange('ebook')}
                    />
                    E-book
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.category.includes('offline')}
                      onChange={() => handleBookTypeChange('offline')}
                    />
                    Physical Book
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label>Genre</label>
                <div className="genre-grid">
                  {genres.map(genre => (
                    <label key={genre} className="genre-checkbox">
                      <input
                        type="checkbox"
                        value={genre}
                        checked={formData.genre.includes(genre)}
                        onChange={handleGenreChange}
                      />
                      {genre}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price ($)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="rentPrice">Rent Price ($)</label>
                  <input
                    type="number"
                    id="rentPrice"
                    name="rentPrice"
                    value={formData.rentPrice}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Author Information</h3>
              
              <div className="form-group">
                <label htmlFor="author.name">Author Name</label>
                <input
                  type="text"
                  id="author.name"
                  name="author.name"
                  value={formData.author.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="author.bio">Author Bio</label>
                <textarea
                  id="author.bio"
                  name="author.bio"
                  value={formData.author.bio}
                  onChange={handleChange}
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label>Author Image</label>
                <div className="image-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'author')}
                  />
                  {authorImagePreview && (
                    <img
                      src={authorImagePreview}
                      alt="Author preview"
                      className="image-preview"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Book Cover</h3>
              <div className="cover-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'cover')}
                />
                {coverPreview && (
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="cover-preview"
                  />
                )}
              </div>
            </div>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '20px',
            padding: '10px',
            position: 'sticky',
            bottom: '0',
            backgroundColor: 'white',
            zIndex: '1000'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                background: '#f0f0f0',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                minWidth: '100px'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                minWidth: '100px'
              }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookEditModal; 