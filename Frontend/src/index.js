import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App } from './Components/App';

// Render the React application to the root element in the DOM
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // Attach the rendered component to the element with the 'root' ID
);
