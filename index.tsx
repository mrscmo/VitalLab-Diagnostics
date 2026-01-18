import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const mount = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Failed to find the root element. Ensure <div id='root'></div> exists in index.html.");
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Error mounting React application:", error);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}