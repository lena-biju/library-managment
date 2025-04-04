import React, { useState, useEffect } from 'react';
import './BookEditModal.css';

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
    status: 'available'
  });

  const [coverPreview, setCoverPreview] = useState('');
  const [authorImagePreview, setAuthorImagePreview] = useState('');

  useEffect(() => {
    if (book) {
      setFormData({
        ...book,
        genre: book.genre || [],
        price: book.price || 29.99,
        rentPrice: book.rentPrice || 9.99
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
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

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              {book?.id ? 'Save Changes' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookEditModal; 