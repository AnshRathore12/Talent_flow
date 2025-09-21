import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'
import { makeServer } from './server'
import { setupMirageJSForProduction } from './mimeHandlerMirage'
import { seedData } from './lib/database'

// Start Mirage server in both development and production
// In production, this will handle both API mocking and static file serving
makeServer({ 
  environment: import.meta.env.PROD ? 'production' : 'development' 
})

// Always start the specialized MirageJS instance for MIME type handling
// This ensures JavaScript modules are served with the correct MIME type
// This is a pure client-side solution - no Express or Node.js server required
setupMirageJSForProduction();

// Initialize database and seed data only if empty
seedData().then(async () => {
  console.log('Database seeding completed');
  
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <App />
        <Toaster position="top-right" />
      </BrowserRouter>
    </React.StrictMode>,
  )
}).catch(error => {
  console.error('Failed to initialize database:', error);
  
  // Render app anyway to avoid complete failure
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <App />
        <Toaster position="top-right" />
      </BrowserRouter>
    </React.StrictMode>,
  )
});
