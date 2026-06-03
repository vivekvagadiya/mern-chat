import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { ToastProvider, useToast } from './components/ToastContainer.jsx';
import { setToastHandler } from './api/axios.js';
import { useSelector } from 'react-redux';
import { AuthInitializer } from './components/AuthInitializer.jsx';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isInitialized } = useSelector((s) => s.auth);

  if (!isInitialized) {
    // return <AppLoader />;
    return <div>loading111...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isAuthenticated, isInitialized } = useSelector((s) => s.auth);

  if (!isInitialized) {
    // return <ChatWindowSkeleton />;
    return <div>loading...</div>;
  }

  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

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
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />

      {/* Main App Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      />

      {/* 404/Not Found Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthInitializer>
        <AppContent />
      </AuthInitializer>
    </Router>
  );
}
