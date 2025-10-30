import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// The app is now fully client-side and can be rendered directly.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


// Add Service Worker registration for PWA and offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // FIX: Corrected service worker registration from `service-worker` to `serviceWorker`.
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  });
}