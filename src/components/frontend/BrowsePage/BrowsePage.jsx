import React, { useState } from 'react';
import Navigation from '../Navigation/Navigation';
import BookGrid from '../BookGrid/BookGrid';
import './BrowsePage.css';

const BrowsePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  // Mock data - replace with actual API call
  const books = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e",
      rating: 4.5,
      readProgress: 75,
      isFavorite: true,
      category: "classic"
    },
    // Add more mock books here
  ];

  const categories = [
    { id: 'all', name: 'All Books' },
    { id: 'fiction', name: 'Fiction' },
    { id: 'non-fiction', name: 'Non-Fiction' },
    { id: 'classic', name: 'Classics' },
    { id: 'fantasy', name: 'Fantasy' },
    { id: 'mystery', name: 'Mystery' }
  ];

  const sortOptions = [
    { id: 'popular', name: 'Most Popular' },
    { id: 'newest', name: 'Newest First' },
    { id: 'rating', name: 'Highest Rated' }
  ];

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

        <BookGrid books={books} />
      </div>
    </div>
  );
};

export default BrowsePage; 