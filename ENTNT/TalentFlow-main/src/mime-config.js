/**
 * Vite specific configuration to set proper MIME types
 * This file will be included in the build output
 */

// Export MIME type configurations for the Vite build
export const mimeTypes = {
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

// Fix for module MIME types when serving from static hosts
if (typeof document !== 'undefined') {
  // Only run in browser context
  (function fixMimeTypes() {
    console.log('Setting up MIME type fixes');
    
    // Create a service worker for MIME type handling
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/mime-sw.js')
          .then(registration => {
            console.log('MIME type ServiceWorker registered:', registration);
          })
          .catch(error => {
            console.error('ServiceWorker registration failed:', error);
          });
      });
    }
  })();
}

// This module doesn't need to do anything else - it just needs to be imported
console.log('MIME type configuration module loaded');