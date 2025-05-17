const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Constants for file paths
const ASSETS_DIR = path.join(__dirname, '..', 'assets');
const BOOKS_DIR = path.join(ASSETS_DIR, 'books');
const COVERS_DIR = path.join(BOOKS_DIR, 'covers');
const AUTHORS_DIR = path.join(BOOKS_DIR, 'authors');
const TEXT_DIR = path.join(BOOKS_DIR, 'text');
const BOOKS_FILE_PATH = path.join(ASSETS_DIR, 'books.json');

// Ensure directories exist
function ensureDirectories() {
  const dirs = [ASSETS_DIR, BOOKS_DIR, COVERS_DIR, AUTHORS_DIR, TEXT_DIR];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
}

// Call this immediately
ensureDirectories();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = req.params.type === 'covers' ? COVERS_DIR : AUTHORS_DIR;
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Ensure directory structure exists
async function ensureDirectoryStructure() {
  try {
    console.log('Creating directory structure...');
    console.log('ASSETS_DIR:', ASSETS_DIR);
    console.log('BOOKS_FILE_PATH:', BOOKS_FILE_PATH);

    // Create directories if they don't exist
    await fs.promises.mkdir(ASSETS_DIR, { recursive: true });
    await fs.promises.mkdir(BOOKS_DIR, { recursive: true });
    await fs.promises.mkdir(COVERS_DIR, { recursive: true });
    await fs.promises.mkdir(TEXT_DIR, { recursive: true });

    // Check if books.json exists
    try {
      await fs.promises.access(BOOKS_FILE_PATH);
      console.log('books.json exists');
      
      // Verify the file is readable and contains valid JSON
      const data = await fs.promises.readFile(BOOKS_FILE_PATH, 'utf8');
      try {
        JSON.parse(data);
        console.log('books.json contains valid JSON');
      } catch (parseError) {
        console.error('books.json contains invalid JSON, recreating...');
        throw parseError;
      }
    } catch (error) {
      console.log('books.json does not exist or is invalid, creating it...');
      // books.json doesn't exist or is invalid, create it with initial structure
      const initialData = {
        books: [],
        metadata: {
          total_books: 0,
          last_updated: new Date().toISOString().split('T')[0],
          version: "1.0"
        }
      };
      await fs.promises.writeFile(BOOKS_FILE_PATH, JSON.stringify(initialData, null, 2));
      console.log('books.json created successfully');
    }
  } catch (error) {
    console.error('Error creating directory structure:', error);
    throw error;
  }
}

// API Endpoints
app.get('/api/books', async (req, res) => {
  try {
    console.log('GET /api/books - Reading books.json');
    const data = await fs.promises.readFile(BOOKS_FILE_PATH, 'utf8');
    
    try {
      const books = JSON.parse(data);
      console.log('Successfully parsed books data');
      res.json(books);
    } catch (parseError) {
      console.error('Error parsing books.json:', parseError);
      // If the file is corrupted, create a new one
      const initialData = {
        books: [],
        metadata: {
          total_books: 0,
          last_updated: new Date().toISOString().split('T')[0],
          version: "1.0"
        }
      };
      await fs.promises.writeFile(BOOKS_FILE_PATH, JSON.stringify(initialData, null, 2));
      res.json(initialData);
    }
  } catch (error) {
    console.error('Error reading books:', error);
    res.status(500).json({ error: 'Failed to read books data' });
  }
});

// File upload endpoint
app.post('/api/upload/:type', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get the relative path for storage in the database
    const relativePath = req.file.path.replace(/\\/g, '/').replace(/^src\//, '');
    console.log('File uploaded successfully:', relativePath);

    res.json({
      success: true,
      filePath: relativePath
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/books/update', async (req, res) => {
  try {
    console.log('POST /api/books/update - Received request body:', JSON.stringify(req.body, null, 2));
    const { books, metadata } = req.body;
    
    if (!books || !metadata) {
      console.error('Invalid request body structure:', req.body);
      return res.status(400).json({ error: 'Invalid request body structure' });
    }

    // Ensure the file exists and is writable
    try {
      await fs.promises.access(BOOKS_FILE_PATH, fs.promises.constants.R_OK | fs.promises.constants.W_OK);
      console.log('books.json is accessible for reading and writing');
    } catch (error) {
      console.error('books.json is not accessible:', error);
      return res.status(500).json({ error: 'Database file is not accessible' });
    }

    const data = JSON.stringify({ books, metadata }, null, 2);
    console.log('Writing to books.json:', data);
    
    try {
      await fs.promises.writeFile(BOOKS_FILE_PATH, data);
      console.log('Successfully updated books.json');
      res.json({ message: 'Books updated successfully' });
    } catch (writeError) {
      console.error('Error writing to books.json:', writeError);
      return res.status(500).json({ error: 'Failed to write to books file' });
    }
  } catch (error) {
    console.error('Error updating books:', error);
    res.status(500).json({ error: 'Failed to update books data' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
ensureDirectoryStructure()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Books file path: ${BOOKS_FILE_PATH}`);
    });
  })
  .catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
  }); 