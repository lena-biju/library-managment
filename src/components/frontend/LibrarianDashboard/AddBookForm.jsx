import React, { useState } from 'react';
import './AddBookForm.css';

const AddBookForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: {
      name: '',
      bio: '',
      profile_picture: ''
    },
    isbn: '',
    genre: [],
    language: 'English',
    published_year: new Date().getFullYear(),
    cover_image: '',
    description: '',
    file_type: 'text',
    file_path: '',
    content: '',
    total_pages: 0,
    read_time: 0,
    rating: 0,
    reviews: [],
    availability: 'available',
    bookmark: null,
    audio_version: null,
    purchase_link: '',
    book_type: {
      isEbook: false,
      isOffline: false
    }
  });

  const [coverImageFile, setCoverImageFile] = useState(null);
  const [authorImageFile, setAuthorImageFile] = useState(null);
  const [genreInput, setGenreInput] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
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
      // Validate file type
      if (!file.type.match(/^image\/(jpeg|png|gif)$/)) {
        throw new Error('Please select a valid image file (JPEG, PNG, or GIF)');
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file:', file.name);
      // Upload file to server
      const response = await fetch(`http://localhost:3001/api/upload/${type === 'cover' ? 'covers' : 'authors'}`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload response:', errorText);
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || 'Failed to upload image');
        } catch (e) {
          throw new Error(`Failed to upload image: ${errorText}`);
        }
      }

      const data = await response.json();
      console.log('Upload response:', data);
      
      if (!data.success || !data.filePath) {
        throw new Error('Invalid server response');
      }

      // Create a temporary URL for preview
      const imageUrl = URL.createObjectURL(file);

      if (type === 'cover') {
        setCoverImageFile(file);
        setFormData(prev => ({
          ...prev,
          cover_image: data.filePath
        }));
      } else if (type === 'author') {
        setAuthorImageFile(file);
        setFormData(prev => ({
          ...prev,
          author: {
            ...prev.author,
            profile_picture: data.filePath
          }
        }));
      }
    } catch (error) {
      console.error('Error handling image:', error);
      alert(error.message || 'Failed to upload image. Please try again.');
      // Reset the file input
      e.target.value = '';
    }
  };

  const handleAddGenre = () => {
    if (genreInput.trim() && !formData.genre.includes(genreInput.trim())) {
      setFormData(prev => ({
        ...prev,
        genre: [...prev.genre, genreInput.trim()]
      }));
      setGenreInput('');
    }
  };

  const handleRemoveGenre = (genreToRemove) => {
    setFormData(prev => ({
      ...prev,
      genre: prev.genre.filter(g => g !== genreToRemove)
    }));
  };

  const handleBookTypeChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      book_type: {
        ...prev.book_type,
        [name]: checked
      }
    }));
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();

    // Generate a new unique ID
    const newId = Date.now();
    
    // Determine the book type category
    let category = [];
    if (formData.book_type.isEbook) category.push('ebook');
    if (formData.book_type.isOffline) category.push('offline');
    
    // Create the final book object
    const newBook = {
      id: newId,
      ...formData,
      category: category.length === 0 ? ['offline'] : category, // Default to offline if none selected
      rating: parseFloat(formData.rating) || 0,
      total_pages: parseInt(formData.total_pages) || 0,
      read_time: parseInt(formData.read_time) || 0,
      published_year: parseInt(formData.published_year) || new Date().getFullYear()
    };

    // Save images if they exist
    if (coverImageFile) {
      const coverPath = `assets/books/covers/${coverImageFile.name}`;
      newBook.cover_image = coverPath;
    }

    if (authorImageFile) {
      const authorImagePath = `assets/books/authors/${authorImageFile.name}`;
      newBook.author.profile_picture = authorImagePath;
    }

    // Call the onSave prop with the new book data
    onSave(newBook);
  };

  const handleAddNow = async (e) => {
    e.preventDefault();

    try {
      // Validate required fields
      const requiredFields = ['title', 'isbn', 'author.name', 'description'];
      const missingFields = requiredFields.filter(field => {
        const value = field.includes('.') 
          ? formData[field.split('.')[0]][field.split('.')[1]]
          : formData[field];
        return !value;
      });

      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }

      console.log('Fetching existing books...');
      // Get existing books from API
      const response = await fetch('http://localhost:3001/api/books');
      if (!response.ok) {
        throw new Error(`Failed to fetch books: ${response.statusText}`);
      }
      const data = await response.json();
      const existingBooks = data.books || [];

      console.log('Creating new book object...');
      // Find highest ID and increment
      const maxId = existingBooks.length > 0 
        ? Math.max(...existingBooks.map(book => parseInt(book.id)))
        : 0;
      const newId = (maxId + 1).toString();

      // Determine the book type category
      let category = [];
      if (formData.book_type.isEbook) category.push('ebook');
      if (formData.book_type.isOffline) category.push('offline');

      // Create the final book object
      const newBook = {
        id: newId,
        title: formData.title,
        author: {
          name: formData.author.name,
          bio: formData.author.bio || '',
          profile_picture: formData.author.profile_picture || `assets/books/authors/default-author.jpg`
        },
        isbn: formData.isbn,
        genre: formData.genre,
        language: formData.language || 'English',
        published_year: parseInt(formData.published_year) || new Date().getFullYear(),
        cover_image: formData.cover_image || `assets/books/covers/default-cover.jpg`,
        description: formData.description,
        file_type: formData.file_type || 'text',
        file_path: formData.file_path || `assets/books/text/${newId}-${formData.title.toLowerCase().replace(/\s+/g, '-')}.txt`,
        content: formData.content || '',
        total_pages: parseInt(formData.total_pages) || 0,
        read_time: parseInt(formData.read_time) || 0,
        rating: parseFloat(formData.rating) || 0,
        reviews: formData.reviews || [],
        availability: formData.availability || 'available',
        bookmark: null,
        audio_version: null,
        purchase_link: formData.purchase_link || '',
        category: category.length === 0 ? ['offline'] : category
      };

      console.log('New book object:', newBook);

      // Add new book to existing books
      const updatedBooks = [...existingBooks, newBook];

      console.log('Saving updated books to server...');
      // Save to books.json via API
      const saveResponse = await fetch('http://localhost:3001/api/books/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          books: updatedBooks,
          metadata: {
            total_books: updatedBooks.length,
            last_updated: new Date().toISOString().split('T')[0],
            version: "1.0"
          }
        })
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.error || 'Failed to save book to database');
      }

      console.log('Book saved successfully, updating localStorage...');
      // Update localStorage
      localStorage.setItem('books', JSON.stringify(updatedBooks));

      // Call the onSave prop with the new book data
      onSave(newBook);

      // Clear the form after successful addition
      setFormData({
        title: '',
        author: {
          name: '',
          bio: '',
          profile_picture: ''
        },
        isbn: '',
        genre: [],
        language: 'English',
        published_year: new Date().getFullYear(),
        cover_image: '',
        description: '',
        file_type: 'text',
        file_path: '',
        content: '',
        total_pages: 0,
        read_time: 0,
        rating: 0,
        reviews: [],
        availability: 'available',
        bookmark: null,
        audio_version: null,
        purchase_link: '',
        book_type: {
          isEbook: false,
          isOffline: false
        }
      });
      setCoverImageFile(null);
      setAuthorImageFile(null);
      setGenreInput('');

      alert('Book added successfully!');

    } catch (error) {
      console.error('Error adding book:', error);
      alert(`Failed to add book: ${error.message}`);
    }
  };

  return (
    <div className="add-book-form">
      <h2>Add New Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
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
                  name="isEbook"
                  checked={formData.book_type.isEbook}
                  onChange={handleBookTypeChange}
                />
                E-book
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isOffline"
                  checked={formData.book_type.isOffline}
                  onChange={handleBookTypeChange}
                />
                Offline
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>ISBN</label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'cover')}
            />
            {formData.cover_image && (
              <img 
                src={formData.cover_image} 
                alt="Cover preview" 
                className="image-preview"
              />
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>Author Information</h3>
          <div className="form-group">
            <label>Author Name</label>
            <input
              type="text"
              name="author.name"
              value={formData.author.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Author Bio</label>
            <textarea
              name="author.bio"
              value={formData.author.bio}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Author Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'author')}
            />
            {formData.author.profile_picture && (
              <img 
                src={formData.author.profile_picture} 
                alt="Author preview" 
                className="image-preview"
              />
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>Book Details</h3>
          <div className="form-group">
            <label>Genre</label>
            <div className="genre-input">
              <input
                type="text"
                value={genreInput}
                onChange={(e) => setGenreInput(e.target.value)}
                placeholder="Enter a genre"
              />
              <button type="button" onClick={handleAddGenre}>Add</button>
            </div>
            <div className="genre-tags">
              {formData.genre.map(genre => (
                <span key={genre} className="genre-tag">
                  {genre}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveGenre(genre)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Language</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Published Year</label>
            <input
              type="number"
              name="published_year"
              value={formData.published_year}
              onChange={handleChange}
              min="1800"
              max={new Date().getFullYear()}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Total Pages</label>
            <input
              type="number"
              name="total_pages"
              value={formData.total_pages}
              onChange={handleChange}
              min="1"
            />
          </div>

          <div className="form-group">
            <label>Read Time (hours)</label>
            <input
              type="number"
              name="read_time"
              value={formData.read_time}
              onChange={handleChange}
              min="0"
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label>Purchase Link</label>
            <input
              type="url"
              name="purchase_link"
              value={formData.purchase_link}
              onChange={handleChange}
              placeholder="https://example.com/book"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">Save Book</button>
          <button type="button" className="add-now-btn" onClick={handleAddNow}>
            Add Now
          </button>
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBookForm; 