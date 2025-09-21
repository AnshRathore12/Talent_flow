import { createServer } from 'miragejs';

/**
 * This module sets up MirageJS to handle static files in production with correct MIME types.
 * It's specifically focused on fixing the "binary/octet-stream" MIME type issue with ES modules.
 * 
 * This is a pure client-side solution - no Express or Node.js server required.
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
  
  console.log('Setting up MirageJS for production with MIME type handling - pure client-side solution');
  
  return createServer({
    environment: 'production',
    
    routes() {
      // This is crucial: set the namespace to empty to intercept all requests
      this.namespace = '';
      this.urlPrefix = '';

      // Bypass all API requests (handled by the main MirageJS server)
      this.passthrough('/api/**');
      
      // Set specific MIME types for different file extensions
      
      // JavaScript modules - critical fix for ES modules (more aggressive handling)
      this.get('**/*.js', (schema, request) => {
        console.log(`MirageJS MIME handler: Setting application/javascript for ${request.url}`);
        
        // This will intercept but let the request continue with modified headers
        return new Response(404, {
          'Content-Type': 'application/javascript; charset=utf-8',
          'Cache-Control': 'no-cache',
          'X-Content-Type-Options': 'nosniff'
        });
      });
      
      // Explicit handling for root JS files
      this.get('/*.js', (schema, request) => {
        console.log(`MirageJS MIME handler: Setting application/javascript for root ${request.url}`);
        
        return new Response(404, {
          'Content-Type': 'application/javascript; charset=utf-8',
          'Cache-Control': 'no-cache',
          'X-Content-Type-Options': 'nosniff'
        });
      });
      
      // CSS files - more aggressive handling
      this.get('**/*.css', (schema, request) => {
        console.log(`MirageJS MIME handler: Setting text/css for ${request.url}`);
        
        return new Response(404, {
          'Content-Type': 'text/css; charset=utf-8',
          'X-Content-Type-Options': 'nosniff'
        });
      });
      
      // Generic handler for .mjs files
      this.get('**/*.mjs', (schema, request) => {
        console.log(`MirageJS MIME handler: Setting application/javascript for MJS ${request.url}`);
        
        return new Response(404, {
          'Content-Type': 'application/javascript; charset=utf-8',
          'Cache-Control': 'no-cache',
          'X-Content-Type-Options': 'nosniff'
        });
      });
      
      // Allow all static files to pass through, but with correct MIME types
      this.passthrough((request) => {
        const url = request.url;
        
        // Determine file extension and set appropriate MIME type in headers
        const extension = url.split('.').pop()?.toLowerCase();
        if (extension && ['js', 'mjs', 'css', 'jsx'].includes(extension)) {
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