
// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App.jsx'; // Updated to point to pages/App.jsx

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
