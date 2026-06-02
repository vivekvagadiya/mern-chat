import { useToast } from '../components/ToastContainer';

// Custom hook for easier toast usage
export const useCustomToast = () => {
  const toast = useToast();

  return {
    // Basic methods
    success: (message, options = {}) => toast.success(message, options),
    error: (message, options = {}) => toast.error(message, options),
    warning: (message, options = {}) => toast.warning(message, options),
    info: (message, options = {}) => toast.info(message, options),

    // Advanced methods with common use cases
    loginSuccess: (username) => 
      toast.success(`Welcome back, ${username}!`, {
        title: 'Login Successful',
        duration: 3000
      }),

    loginError: (error) => 
      toast.error(error || 'Invalid credentials', {
        title: 'Login Failed',
        duration: 5000
      }),

    registerSuccess: (username) => 
      toast.success(`Account created for ${username}!`, {
        title: 'Registration Successful',
        duration: 3000
      }),

    registerError: (error) => 
      toast.error(error || 'Registration failed', {
        title: 'Registration Failed',
        duration: 5000
      }),

    logoutSuccess: () => 
      toast.info('You have been logged out successfully', {
        title: 'Logged Out',
        duration: 3000
      }),

    messageSent: () => 
      toast.success('Message sent successfully', {
        title: 'Message Delivered',
        duration: 2000
      }),

    messageError: (error) => 
      toast.error(error || 'Failed to send message', {
        title: 'Message Failed',
        duration: 4000
      }),

    networkError: () => 
      toast.error('Please check your internet connection', {
        title: 'Network Error',
        duration: 5000
      }),

    fileUploadSuccess: (filename) => 
      toast.success(`${filename} uploaded successfully`, {
        title: 'Upload Complete',
        duration: 3000
      }),

    fileUploadError: (error) => 
      toast.error(error || 'File upload failed', {
        title: 'Upload Failed',
        duration: 4000
      }),

    // Generic API error handler
    apiError: (error, defaultMessage = 'Something went wrong') => {
      const message = error?.response?.data?.message || error?.message || defaultMessage;
      return toast.error(message, {
        title: 'Error',
        duration: 5000
      });
    },

    // Success with action
    successWithAction: (message, action) => 
      toast.success(message, {
        title: 'Success',
        action,
        duration: 6000
      }),

    // Persistent notification
    persistent: (message, type = 'info') => 
      toast.addToast({
        type,
        message,
        autoClose: false,
        title: type.charAt(0).toUpperCase() + type.slice(1)
      })
  };
};

export default useCustomToast;
