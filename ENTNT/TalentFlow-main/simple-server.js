import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT || 3000;
const distPath = join(__dirname, 'dist');

const mimeTypes = {
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.json': 'application/json'
};

const server = createServer((req, res) => {
  let filePath = join(distPath, req.url === '/' ? 'index.html' : req.url);
  
  // Handle React Router - if file doesn't exist, serve index.html
  if (!existsSync(filePath) && !req.url.startsWith('/assets/')) {
    filePath = join(distPath, 'index.html');
  }
  
  try {
    const ext = extname(filePath).toLowerCase();
    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    
    console.log(`Serving: ${req.url} -> ${filePath}, MIME: ${mimeType}`);
    
    const content = readFileSync(filePath);
    
    res.writeHead(200, {
      'Content-Type': mimeType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });
    
    res.end(content);
  } catch (error) {
    console.error('Error serving file:', error);
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('File not found');
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Simple server running on port ${port}`);
  console.log(`Serving files from: ${distPath}`);
});