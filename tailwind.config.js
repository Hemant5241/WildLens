/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4edea3',
          container: '#10b981',
          dim: '#0d9668',
        },
        on: {
          primary: '#003824',
          surface: {
            DEFAULT: '#dee2f2',
            variant: '#9ca3b8',
            muted: '#6b7280',
          }
        },
        surface: {
          DEFAULT: '#0e131e',
          dim: '#0a0f1a',
          bright: '#343946',
          container: {
            lowest: '#060a12',
            low: '#121827',
            DEFAULT: '#1b1f2b',
            high: '#252a36',
            highest: '#303541',
          }
        },
        background: '#0a0f1a',
        danger: {
          DEFAULT: '#ef4444',
          dim: '#dc2626',
          bg: 'rgba(239, 68, 68, 0.1)',
        },
        warning: {
          DEFAULT: '#f59e0b',
          bg: 'rgba(245, 158, 11, 0.1)',
        },
        success: {
          DEFAULT: '#10b981',
          bg: 'rgba(16, 185, 129, 0.1)',
        },
        info: '#3b82f6',
        outline: {
          DEFAULT: '#86948a',
          variant: 'rgba(60, 74, 66, 0.4)',
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(78, 222, 163, 0.15)',
        sm: '0 2px 8px rgba(5, 8, 15, 0.3)',
        md: '0 4px 16px rgba(5, 8, 15, 0.4)',
        lg: '0 8px 32px rgba(5, 8, 15, 0.5)',
      },
      animation: {
        'pulse-ring': 'pulse-ring 3s ease-in-out infinite',
        'scanner-rotate': 'scanner-rotate 2s linear infinite',
        'scanner-pulse': 'scanner-pulse 1.5s ease-in-out infinite',
        'scanner-icon-pulse': 'scanner-icon-pulse 1.5s ease-in-out infinite',
        'telemetry-fade': 'telemetry-fade 0.5s ease-out forwards',
        'telemetry-blink': 'telemetry-blink 1s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.6s ease-out forwards',
      },
      keyframes: {
        'pulse-ring': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.6' },
        },
        'scanner-rotate': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        'scanner-pulse': {
          '0%, 100%': { opacity: '0.5', transform: 'scale(0.98)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        'scanner-icon-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'telemetry-fade': {
          'from': { opacity: '0', transform: 'translateY(8px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'telemetry-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.2' },
        },
        'fade-in': {
          'from': { opacity: '0', transform: 'translateY(16px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          'from': { opacity: '0', transform: 'translateY(24px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
