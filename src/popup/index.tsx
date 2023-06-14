import React from 'react';
import ReactDOM from 'react-dom/client';
import { Popup } from './components/Popup';
import '../styles/popup.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  // React.StrictMode component enables additional React runtime checks and warnings during development
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
