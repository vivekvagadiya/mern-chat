import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Lock, Mail, User, ArrowLeft } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle, backLink }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          
          {/* Left side - Branding */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-2xl">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="ml-3 text-3xl lg:text-4xl font-bold text-white">
                ChatFlow
              </h1>
            </div>
            
            <h2 className="text-xl lg:text-2xl text-white/90 mb-4">
              Connect. Chat. Collaborate.
            </h2>
            
            <p className="text-base lg:text-lg text-white/70 max-w-md mx-auto lg:mx-0">
              Experience real-time messaging with crystal-clear voice calls, 
              file sharing, and seamless collaboration tools.
            </p>

            {/* Features */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-center lg:justify-start text-white/80">
                <Lock className="w-5 h-5 mr-3 text-purple-400" />
                <span className="text-sm lg:text-base">End-to-end encryption</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start text-white/80">
                <MessageCircle className="w-5 h-5 mr-3 text-pink-400" />
                <span className="text-sm lg:text-base">Real-time messaging</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start text-white/80">
                <User className="w-5 h-5 mr-3 text-blue-400" />
                <span className="text-sm lg:text-base">Group conversations</span>
              </div>
            </div>
          </motion.div>

          {/* Right side - Auth Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 w-full max-w-md"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-2xl border border-white/20">
              
              {/* Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  {title}
                </h3>
                <p className="text-white/70 text-sm lg:text-base">
                  {subtitle}
                </p>
              </div>

              {/* Form Content */}
              <div className="space-y-6">
                {children}
              </div>

              {/* Footer */}
              {backLink && (
                <div className="mt-8 text-center">
                  <Link 
                    to={backLink.to}
                    className="inline-flex items-center text-white/70 hover:text-white transition-colors text-sm lg:text-base"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {backLink.text}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
