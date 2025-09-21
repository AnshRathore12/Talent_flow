import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Force MIME types for all JavaScript files - more specific middleware
app.use('/assets', (req, res, next) => {
  const url = req.url;
  if (url.endsWith('.js') || url.endsWith('.mjs')) {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    console.log(`Setting JS MIME type for: ${req.originalUrl}`);
  } else if (url.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css; charset=utf-8');
    console.log(`Setting CSS MIME type for: ${req.originalUrl}`);
  }
  next();
});

// Explicit route for JavaScript files to ensure MIME type
app.get('*.js', (req, res, next) => {
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  console.log(`Explicit JS handler for: ${req.originalUrl}`);
  next();
});

app.get('*.mjs', (req, res, next) => {
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  console.log(`Explicit MJS handler for: ${req.originalUrl}`);
  next();
});

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
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    const mimeType = mimeTypes[ext];
    
    console.log(`Serving: ${filePath}, Extension: ${ext}, MIME: ${mimeType}`);
    
    // Force JavaScript MIME type for any .js files - CRITICAL for ES modules
    if (ext === '.js' || ext === '.mjs') {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      // Ensure no other content-type headers interfere
      res.removeHeader('content-type'); // Remove any existing content-type
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      console.log('FORCED JavaScript MIME type for:', filePath);
    } else if (mimeType) {
      res.setHeader('Content-Type', mimeType);
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
  console.log(`Serving static files from: ${join(__dirname, 'dist')}`);
});