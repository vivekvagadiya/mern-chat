/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium dark theme
        'dark-bg': '#0f0f12',
        'dark-surface': '#1a1a1e',
        'dark-surface-alt': '#252530',
        'dark-surface-2': '#323238',
        'dark-border': '#3a3a42',
        'dark-text': '#e8e8ec',
        'dark-text-secondary': '#a0a0a8',
        'dark-text-muted': '#767680',
        
        // Brand colors
        'primary': '#6366f1',
        'primary-dark': '#4f46e5',
        'primary-light': '#818cf8',
        'accent': '#ec4899',
        'accent-dark': '#db2777',
        'success': '#10b981',
        'warning': '#f59e0b',
        'error': '#ef4444',
        
        // Glassmorphism support
        'glass': 'rgba(26, 26, 30, 0.6)',
        'glass-dark': 'rgba(15, 15, 18, 0.7)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3), inset 1px 1px 0 rgba(255, 255, 255, 0.05)',
        'glass-sm': '0 4px 16px rgba(0, 0, 0, 0.2), inset 1px 1px 0 rgba(255, 255, 255, 0.03)',
        'elevation-1': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'elevation-2': '0 8px 16px rgba(0, 0, 0, 0.4)',
        'elevation-3': '0 16px 32px rgba(0, 0, 0, 0.5)',
      },
      borderColor: {
        'glass': 'rgba(255, 255, 255, 0.08)',
        'glass-light': 'rgba(255, 255, 255, 0.12)',
      },
      fontFamily: {
        'sans': ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        'display': ['"Space Grotesk"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounceGentle 0.8s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      transitionDuration: {
        '250': '250ms',
      },
    },
  },
  plugins: [],
}
