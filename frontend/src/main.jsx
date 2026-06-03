import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import ToastProvider from './components/ToastContainer.jsx';
import { AuthInitializer } from './components/AuthInitializer.jsx';
import store from './store/index.js';
import { Provider } from 'react-redux';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <AuthInitializer>
          <App />
        </AuthInitializer>
      </ToastProvider>
    </Provider>
  </React.StrictMode>
);
