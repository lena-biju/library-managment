import React, { useState, useMemo } from 'react';
import Navigation from '../Navigation/Navigation';
import BookGrid from '../BookGrid/BookGrid';
import { getBooks, getAllGenres } from '../../../booksData';
import './BrowsePage.css';

const BrowsePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const categories = [
    { id: 'all', name: 'All Books' },
    ...getAllGenres().map(genre => ({
      id: genre.toLowerCase(),
      name: genre
    }))
  ];

  const sortOptions = [
    { id: 'popular', name: 'Most Popular' },
    { id: 'newest', name: 'Newest First' },
    { id: 'rating', name: 'Highest Rated' }
  ];

  const filteredAndSortedBooks = useMemo(() => {
    let books = getBooks();

    // Filter by category
    if (selectedCategory !== 'all') {
      books = books.filter(book => 
        book.genre.some(g => g.toLowerCase() === selectedCategory)
      );
    }

    // Sort books
    switch (sortBy) {
      case 'newest':
        books.sort((a, b) => b.publishedYear - a.publishedYear);
        break;
      case 'rating':
        books.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
      default:
        // For popular, we'll use rating as a proxy for popularity
        books.sort((a, b) => b.rating - a.rating);
        break;
    }

    return books;
  }, [selectedCategory, sortBy]);

  return (
    <div className="browse-page">
      <Navigation />
      
      <div className="browse-content">
        <div className="filters-section">
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="sort-section">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              {sortOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <BookGrid books={filteredAndSortedBooks} />
      </div>
    </div>
  );
};

export default BrowsePage; 