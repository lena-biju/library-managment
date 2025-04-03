import booksData from './assets/books.json';

// Helper function to get the correct image path
const getImagePath = (imagePath) => {
  if (!imagePath) return '/placeholder-book.jpg';
  // Remove 'assets/' from the path since we're already in the assets directory
  return imagePath.replace('assets/', '');
};

// Transform the data to match our component requirements
export const getBooks = () => {
  return booksData.books.map(book => ({
    id: book.id,
    title: book.title,
    description: book.description,
    coverImage: getImagePath(book.cover_image),
    author: book.author.name,
    genre: book.genre,
    rating: book.rating,
    publishedYear: book.published_year,
    totalPages: book.total_pages,
    language: book.language,
    isbn: book.isbn,
    availability: book.availability,
    reviews: book.reviews
  }));
};

// Get featured books (first 5 books)
export const getFeaturedBooks = () => {
  return getBooks().slice(0, 5);
};

// Get recommended books (next 4 books)
export const getRecommendedBooks = () => {
  return getBooks().slice(5, 9);
};

// Get book by ID
export const getBookById = (id) => {
  const book = getBooks().find(book => book.id === parseInt(id));
  if (!book) {
    console.warn(`Book with ID ${id} not found`);
    return null;
  }
  return book;
};

// Get books by genre
export const getBooksByGenre = (genre) => {
  return getBooks().filter(book => 
    book.genre.some(g => g.toLowerCase() === genre.toLowerCase())
  );
};

// Get all unique genres
export const getAllGenres = () => {
  const genres = new Set();
  getBooks().forEach(book => {
    book.genre.forEach(g => genres.add(g));
  });
  return Array.from(genres).sort();
}; 