const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Constants for file paths
const ASSETS_DIR = path.join(__dirname, '..', 'assets');
const BOOKS_DIR = path.join(ASSETS_DIR, 'books');
const COVERS_DIR = path.join(BOOKS_DIR, 'covers');
const TEXT_DIR = path.join(BOOKS_DIR, 'text');
const BOOKS_FILE_PATH = path.join(ASSETS_DIR, 'books.json');

// Ensure directory structure exists
async function ensureDirectoryStructure() {
  try {
    await fs.mkdir(ASSETS_DIR, { recursive: true });
    await fs.mkdir(BOOKS_DIR, { recursive: true });
    await fs.mkdir(COVERS_DIR, { recursive: true });
    await fs.mkdir(TEXT_DIR, { recursive: true });

    try {
      await fs.access(BOOKS_FILE_PATH);
    } catch (error) {
      // books.json doesn't exist, create it with initial structure
      const initialData = {
        books: [],
        metadata: {
          total_books: 0,
          last_updated: new Date().toISOString().split('T')[0],
          version: "1.0"
        }
      };
      await fs.writeFile(BOOKS_FILE_PATH, JSON.stringify(initialData, null, 2));
    }
  } catch (error) {
    console.error('Error creating directory structure:', error);
  }
}

// API Endpoints
app.get('/api/books', async (req, res) => {
  try {
    const data = await fs.readFile(BOOKS_FILE_PATH, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading books:', error);
    res.status(500).json({ error: 'Failed to read books data' });
  }
});

app.post('/api/books/update', async (req, res) => {
  try {
    const { books, metadata } = req.body;
    if (!books || !metadata) {
      return res.status(400).json({ error: 'Invalid request body structure' });
    }

    const data = JSON.stringify({ books, metadata }, null, 2);
    await fs.writeFile(BOOKS_FILE_PATH, data);
    res.json({ message: 'Books updated successfully' });
  } catch (error) {
    console.error('Error updating books:', error);
    res.status(500).json({ error: 'Failed to update books data' });
  }
});

// Start server
ensureDirectoryStructure().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Books file path: ${BOOKS_FILE_PATH}`);
  });
}); 