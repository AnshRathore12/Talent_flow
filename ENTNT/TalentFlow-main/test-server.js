/**
 * Simple testing server that ensures proper MIME types
 * Use this for local testing before deployment
 */

import { readFileSync, existsSync, statSync } from 'fs';
import { createServer } from 'http';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const PORT = process.env.PORT || 5000;
const DIST_DIR = join(__dirname, 'dist');

// MIME types mapping
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// Create the server
const server = createServer((req, res) => {
  try {
    // Get file path
    const url = new URL(req.url, `http://${req.headers.host}`);
    let filePath = join(DIST_DIR, url.pathname === '/' ? 'index.html' : url.pathname);
    
    // Check if file exists
    if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
      // If file doesn't exist, serve index.html (for SPA routing)
      filePath = join(DIST_DIR, 'index.html');
    }
    
    // Get file extension and MIME type
    const ext = extname(filePath).toLowerCase();
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
    
    // Log the request
    console.log(`${req.method} ${req.url} -> ${filePath} (${mimeType})`);
    
    // Read the file
    const content = readFileSync(filePath);
    
    // Set headers
    res.writeHead(200, {
      'Content-Type': mimeType,
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    });
    
    // Send the response
    res.end(content);
    
  } catch (err) {
    // Log error
    console.error(`Error serving ${req.url}:`, err);
    
    // Send 500 response
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`\n🚀 Local test server running at http://localhost:${PORT}/`);
  console.log(`Serving files from: ${DIST_DIR}`);
  console.log(`All JavaScript files will be served with MIME type: ${MIME_TYPES['.js']}`);
  console.log(`Press Ctrl+C to stop\n`);
});