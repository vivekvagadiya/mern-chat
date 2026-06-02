import React, { createContext, useContext, useReducer, useCallback } from 'react';
import Toast from './Toast';

// Toast context
const ToastContext = createContext();

// Toast reducer
const toastReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, action.payload]
      };
    
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload)
      };
    
    case 'CLEAR_ALL':
      return {
        ...state,
        toasts: []
      };
    
    default:
      return state;
  }
};

// Toast provider
export const ToastProvider = ({ children }) => {
  const [state, dispatch] = useReducer(toastReducer, { toasts: [] });

  const addToast = useCallback((toast) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newToast = {
      id,
      type: 'info',
      autoClose: true,
      duration: 5000,
      ...toast
    };
    
    dispatch({ type: 'ADD_TOAST', payload: newToast });
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  // Convenience methods
  const success = useCallback((message, options = {}) => {
    return addToast({ type: 'success', message, ...options });
  }, [addToast]);

  const error = useCallback((message, options = {}) => {
    return addToast({ type: 'error', message, ...options });
  }, [addToast]);

  const warning = useCallback((message, options = {}) => {
    return addToast({ type: 'warning', message, ...options });
  }, [addToast]);

  const info = useCallback((message, options = {}) => {
    return addToast({ type: 'info', message, ...options });
  }, [addToast]);

  const value = {
    toasts: state.toasts,
    addToast,
    removeToast,
    clearAll,
    success,
    error,
    warning,
    info
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={state.toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

// Toast container component
const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

// Hook for using toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;
