import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'
import { makeServer } from './server'
import { seedData } from './lib/database'

// Start Mirage server in both development and production
// In production, this will handle both API mocking and static file serving
makeServer({ 
  environment: import.meta.env.PROD ? 'production' : 'development' 
})

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
