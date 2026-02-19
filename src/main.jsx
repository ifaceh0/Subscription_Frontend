import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { LocationProvider } from './contexts/LocationContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <BrowserRouter>
  //   <App />
  // </BrowserRouter>
  <React.StrictMode>
    <LocationProvider>    
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LocationProvider>
  </React.StrictMode>
);
