import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// More comprehensive MIME type configuration
const mimeTypes = {
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.jsx': 'application/javascript',
  '.ts': 'application/javascript',
  '.tsx': 'application/javascript',
  '.css': 'text/css',
  '.html': 'text/html',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

// Serve static files with correct MIME types
app.use(express.static(join(__dirname, 'dist'), {
  setHeaders: (res, path) => {
    const ext = path.substring(path.lastIndexOf('.'));
    const mimeType = mimeTypes[ext];
    
    if (mimeType) {
      res.setHeader('Content-Type', mimeType);
    }
    
    // Additional headers for JavaScript modules
    if (ext === '.js' || ext === '.mjs') {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
    }
  },
  etag: false,
  lastModified: false
}));

// Handle React Router (return `index.html` for non-API routes)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});