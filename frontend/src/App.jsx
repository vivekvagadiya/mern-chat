import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import store from './store/index.js';
import { AuthInitializer } from './components/AuthInitializer.jsx';
import { ToastProvider, useToast } from './components/ToastContainer.jsx';
import { setToastHandler } from './api/axios.js';

function AppContent() {
  const toast = useToast();

  useEffect(() => {
    // Set up viewport meta tag for mobile
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute(
        'content',
        'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes'
      );
    }

    // Set up toast handler for axios interceptors
    setToastHandler((type, message, options) => {
      toast[type](message, options);
    });
  }, [toast]);

  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Main App Routes */}
      <Route path="/*" element={<MainLayout />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <AuthInitializer>
          <Router>
            <AppContent />
          </Router>
        </AuthInitializer>
      </ToastProvider>
    </Provider>
  );
}
