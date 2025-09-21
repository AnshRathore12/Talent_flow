import { createServer } from 'miragejs';

/**
 * This module sets up MirageJS to handle static files in production with correct MIME types.
 * It's specifically focused on fixing the "binary/octet-stream" MIME type issue with ES modules.
 */

// Define MIME types for different file extensions
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
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

export function setupMirageJSForProduction() {
  if (typeof window === 'undefined') return; // Skip if not in browser
  
  // Get current host and protocol
  const protocol = window.location.protocol;
  const host = window.location.host;
  
  console.log('Setting up MirageJS for production with MIME type handling');
  
  return createServer({
    environment: 'production',
    
    routes() {
      // This is crucial: set the namespace to empty to intercept all requests
      this.namespace = '';
      this.urlPrefix = '';

      // Bypass all API requests (handled by the main MirageJS server)
      this.passthrough('/api/**');
      
      // Set specific MIME types for different file extensions
      
      // JavaScript modules - critical fix for ES modules
      this.get('/assets/**/*.js', (schema, request) => {
        console.log(`MirageJS MIME handler: Setting application/javascript for ${request.url}`);
        
        return new Response(404, {
          'Content-Type': 'application/javascript; charset=utf-8',
          'Cache-Control': 'no-cache',
          'X-Content-Type-Options': 'nosniff'
        });
      });
      
      // CSS files
      this.get('/assets/**/*.css', (schema, request) => {
        console.log(`MirageJS MIME handler: Setting text/css for ${request.url}`);
        
        return new Response(404, {
          'Content-Type': 'text/css; charset=utf-8',
          'X-Content-Type-Options': 'nosniff'
        });
      });
      
      // Allow all static files to pass through, but with correct MIME types
      this.passthrough((request) => {
        const url = request.url;
        
        // Determine file extension and set appropriate MIME type in headers
        const extension = url.split('.').pop();
        if (extension && ['js', 'mjs', 'css'].includes(extension)) {
          const mimeType = extension === 'css' ? 'text/css; charset=utf-8' : 'application/javascript; charset=utf-8';
          
          // Log MIME type handling
          console.log(`MirageJS passthrough with MIME type for ${url}: ${mimeType}`);
          
          // Set MIME type header
          if (request.headers) {
            request.headers['Accept'] = mimeType;
            request.headers['Content-Type'] = mimeType;
          }
        }
        
        return true; // Allow request to pass through
      });
    }
  });
}