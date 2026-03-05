import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import './components/ui/Button.css';
import './components/ui/Badge.css';
import './components/ui/Input.css';
import './components/Navbar.css';
import './components/layout/PageLayout.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);