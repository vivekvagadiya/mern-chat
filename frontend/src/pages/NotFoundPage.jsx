import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, AlertCircle } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* 404 Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-2xl">
              <AlertCircle className="w-16 h-16 text-white" />
            </div>
          </motion.div>

          {/* Error Code */}
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-8xl lg:text-9xl font-bold text-white mb-4"
          >
            404
          </motion.h1>

          {/* Error Message */}
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-3xl lg:text-4xl font-bold text-white mb-4"
          >
            Page Not Found
          </motion.h2>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg lg:text-xl text-white/70 mb-12 max-w-2xl mx-auto"
          >
            Oops! The page you're looking for doesn't exist or has been moved. 
            Let's get you back to where you need to be.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all transform hover:scale-105"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-xl text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all transform hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>
          </motion.div>

          {/* Help Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-16 p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10"
          >
            <div className="flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-purple-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Looking for something specific?</h3>
            </div>
            <p className="text-white/60 text-sm lg:text-base mb-4">
              Try searching for what you need, or check out these popular destinations:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/chat" className="text-purple-400 hover:text-purple-300 transition-colors text-sm">
                Chat
              </Link>
              <span className="text-white/30">•</span>
              <Link to="/login" className="text-purple-400 hover:text-purple-300 transition-colors text-sm">
                Login
              </Link>
              <span className="text-white/30">•</span>
              <Link to="/register" className="text-purple-400 hover:text-purple-300 transition-colors text-sm">
                Register
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
