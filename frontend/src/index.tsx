import React from 'react';
import ReactDOM from "react-dom/client"
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

import App from './App';
import { OpenAPI } from './client';
import { getAccessToken } from './utils/auth';

// Set the token resolver for the API client
OpenAPI.TOKEN = async () => {
  return getAccessToken();
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Wrap App with BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
