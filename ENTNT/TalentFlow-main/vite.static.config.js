import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// Custom plugin to ensure proper MIME types
const ensureMimeTypes = () => {
  return {
    name: 'ensure-mime-types',
    configureServer(server) {
      // Set proper MIME types for all JavaScript files
      server.middlewares.use((req, res, next) => {
        if (req.url.endsWith('.js') || req.url.endsWith('.mjs')) {
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
          res.setHeader('X-Content-Type-Options', 'nosniff');
        }
        next();
      });
    },
    // Copy service worker to output directory
    writeBundle() {
      // Copy the service worker and other MIME type files to the output directory
      if (fs.existsSync('./public/mime-sw.js')) {
        fs.copyFileSync('./public/mime-sw.js', './dist/mime-sw.js');
        console.log('Copied mime-sw.js to output directory');
      }
      
      // Copy custom index file as the main index.html
      if (fs.existsSync('./custom-index.html')) {
        fs.copyFileSync('./custom-index.html', './dist/index.html');
        console.log('Using custom index.html with MIME type fixes');
      }
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ensureMimeTypes()
  ],
  server: {
    port: 3000,
    host: true,
    headers: {
      'X-Content-Type-Options': 'nosniff'
    }
  },
  preview: {
    port: 3000,
    host: true,
    headers: {
      'X-Content-Type-Options': 'nosniff'
    }
  },
  build: {
    outDir: 'dist',
    // Ensure all assets have proper MIME types
    rollupOptions: {
      output: {
        // Ensure JS assets have proper extensions and naming
        entryFileNames: 'assets/index.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    },
    // Add special metadata for MIME types
    assetsInlineLimit: 0 // Don't inline assets to ensure proper MIME types
  }
});