import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import ToastProvider from './components/ToastContainer.jsx';
import store from './store/index.js';
import { Provider } from 'react-redux';
import SocketProvider from './providers/socketProvider.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </ToastProvider>
    </Provider>
  </React.StrictMode>
);
