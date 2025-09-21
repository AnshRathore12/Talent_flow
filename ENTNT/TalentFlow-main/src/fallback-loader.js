/**
 * Fallback loader for module script loading
 * Used when the MIME type is not properly set by the server
 */

// Check if React is already loaded to avoid double-loading
const isReactLoaded = () => typeof window.React !== 'undefined';

// Create a global flag to avoid multiple loading attempts
if (!window._moduleLoadingAttempted) {
  window._moduleLoadingAttempted = true;

  // Dynamically load the main entry point via fetch to control the MIME type
  async function loadModuleScript() {
    try {
      // Skip if already loaded
      if (document.querySelector('script[data-loaded="true"]')) {
        console.log('Module already loaded, skipping fallback loader');
        return;
      }
      
      console.log('Attempting to load main.jsx via fetch with proper MIME type handling');
      
      // Try direct import first - this works on some browsers despite MIME type issues
      try {
        // Create a dynamic import function
        const importModule = new Function('return import("/src/main.jsx")');
        await importModule();
        console.log('Module loaded successfully via direct import');
        return; // Success - no need to try other methods
      } catch (importError) {
        console.log('Direct import failed, trying fetch approach', importError);
      }
      
      // Fetch the bundled script content instead of main.jsx
      const response = await fetch('/assets/index.js');
      if (!response.ok) {
        throw new Error(`Failed to fetch script: ${response.status} ${response.statusText}`);
      }
      
      const scriptText = await response.text();
      
      // Check if the script already contains React setup
      if (scriptText.includes('import React from') && isReactLoaded()) {
        // Need to modify the script to avoid re-declaring React
        const modifiedScript = scriptText.replace(
          /import\s+React\s+from\s+['"]react['"]/g, 
          '// React already loaded - skipping import'
        );
        
        // Create a blob with the proper MIME type
        const blob = new Blob([modifiedScript], { type: 'application/javascript;charset=utf-8' });
        const scriptURL = URL.createObjectURL(blob);
        
        // Create and append the script
        const script = document.createElement('script');
        script.type = 'module';
        script.setAttribute('data-loaded', 'true');
        script.src = scriptURL;
        
        // Handle load/error events
        script.onload = () => console.log('Module loaded successfully via blob URL with React fix');
        script.onerror = (err) => console.error('Module load error via blob URL:', err);
        
        document.body.appendChild(script);
      } else {
        // No React conflict, load normally
        const blob = new Blob([scriptText], { type: 'application/javascript;charset=utf-8' });
        const scriptURL = URL.createObjectURL(blob);
        
        const script = document.createElement('script');
        script.type = 'module';
        script.setAttribute('data-loaded', 'true');
        script.src = scriptURL;
        
        script.onload = () => console.log('Module loaded successfully via blob URL');
        script.onerror = (err) => console.error('Module load error via blob URL:', err);
        
        document.body.appendChild(script);
      }
    } catch (error) {
      console.error('Failed to load script via fetch:', error);
    }
  }

  // Execute the loader
  loadModuleScript();
}