/**
 * Fallback loader for module script loading
 * Used when the MIME type is not properly set by the server
 */

// Dynamically load the main entry point via fetch to control the MIME type
async function loadModuleScript() {
  try {
    console.log('Attempting to load main.jsx via fetch with proper MIME type handling');
    
    // Fetch the script content
    const response = await fetch('/src/main.jsx');
    const scriptText = await response.text();
    
    // Create a blob with the proper MIME type
    const blob = new Blob([scriptText], { type: 'application/javascript;charset=utf-8' });
    const scriptURL = URL.createObjectURL(blob);
    
    // Create and append the script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = scriptURL;
    
    // Handle load/error events
    script.onload = () => console.log('Module loaded successfully via blob URL');
    script.onerror = (err) => console.error('Module load error via blob URL:', err);
    
    document.body.appendChild(script);
  } catch (error) {
    console.error('Failed to load script via fetch:', error);
    
    // Ultimate fallback - import via dynamic import
    console.log('Attempting ultimate fallback via dynamic import');
    
    // Create dynamic import loader
    const loaderScript = document.createElement('script');
    loaderScript.textContent = `
      import('/src/main.jsx')
        .then(() => console.log('Module loaded via dynamic import'))
        .catch(err => console.error('Dynamic import failed:', err));
    `;
    loaderScript.type = 'module';
    document.body.appendChild(loaderScript);
  }
}

// Execute the loader
loadModuleScript();