import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const toastTypes = {
  success: {
    icon: CheckCircle,
    bgColor: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-500/50',
    iconColor: 'text-green-400',
    title: 'Success'
  },
  error: {
    icon: AlertCircle,
    bgColor: 'from-red-500/20 to-pink-500/20',
    borderColor: 'border-red-500/50',
    iconColor: 'text-red-400',
    title: 'Error'
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'from-yellow-500/20 to-orange-500/20',
    borderColor: 'border-yellow-500/50',
    iconColor: 'text-yellow-400',
    title: 'Warning'
  },
  info: {
    icon: Info,
    bgColor: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/50',
    iconColor: 'text-blue-400',
    title: 'Info'
  }
};

const Toast = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  
  const type = toastTypes[toast.type] || toastTypes.info;
  const Icon = type.icon;

  useEffect(() => {
    if (toast.autoClose && toast.duration) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            setIsVisible(false);
            return 0;
          }
          return prev - (100 / (toast.duration / 100));
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [toast.autoClose, toast.duration]);

  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onRemove, toast.id]);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`
            relative w-full max-w-sm mx-auto mb-4
            bg-gradient-to-r ${type.bgColor}
            backdrop-blur-xl
            border ${type.borderColor}
            rounded-2xl
            shadow-2xl
            overflow-hidden
          `}
        >
          <div className="relative p-4">
            {/* Progress Bar */}
            {toast.autoClose && (
              <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: '100%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            )}

            {/* Content */}
            <div className="flex items-start space-x-3">
              {/* Icon */}
              <div className={`flex-shrink-0 w-6 h-6 ${type.iconColor}`}>
                <Icon className="w-full h-full" />
              </div>

              {/* Message */}
              <div className="flex-1 min-w-0">
                {toast.title && (
                  <p className="text-sm font-semibold text-white mb-1">
                    {toast.title}
                  </p>
                )}
                <p className="text-sm text-white/80 break-words">
                  {toast.message}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="flex-shrink-0 w-6 h-6 text-white/50 hover:text-white/80 transition-colors"
              >
                <X className="w-full h-full" />
              </button>
            </div>

            {/* Action Button */}
            {toast.action && (
              <div className="mt-3">
                <button
                  onClick={toast.action.onClick}
                  className="px-3 py-1 text-xs font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {toast.action.label}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
