/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0e131e',
        surface: {
          DEFAULT: '#0e131e',
          dim: '#0e131e',
          bright: '#343946',
          container: {
            lowest: '#090e19',
            low: '#171b27',
            DEFAULT: '#1b1f2b',
            high: '#252a36',
            highest: '#303541',
          },
          variant: '#303541',
          tint: '#4edea3',
        },
        primary: {
          DEFAULT: '#4edea3',
          container: '#10b981',
          fixed: '#6ffbbe',
          'fixed-dim': '#4edea3',
        },
        secondary: {
          DEFAULT: '#9ed2b5',
          container: '#21523c',
          fixed: '#baeed1',
          'fixed-dim': '#9ed2b5',
        },
        tertiary: {
          DEFAULT: '#ffb3af',
          container: '#fc7c78',
        },
        'on-surface': {
          DEFAULT: '#dee2f2',
          variant: '#bbcabf',
          muted: '#6b7a70',
        },
        'on-primary': {
          DEFAULT: '#003824',
          container: '#00422b',
          fixed: '#002113',
        },
        'on-secondary': {
          DEFAULT: '#013824',
          container: '#91c4a8',
        },
        outline: {
          DEFAULT: '#86948a',
          variant: '#3c4a42',
        },
        danger: {
          DEFAULT: '#ff6b6b',
          bg: 'rgba(255, 107, 107, 0.1)',
        },
        warning: {
          DEFAULT: '#fbbf24',
          bg: 'rgba(251, 191, 36, 0.1)',
        },
        success: {
          DEFAULT: '#4edea3',
          bg: 'rgba(78, 222, 163, 0.1)',
        },
        info: {
          DEFAULT: '#60a5fa',
          bg: 'rgba(96, 165, 250, 0.1)',
        },
        error: {
          DEFAULT: '#ffb4ab',
          container: '#93000a',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(78, 222, 163, 0.3)',
        'glow-lg': '0 0 40px rgba(78, 222, 163, 0.2)',
        ambient: '0 20px 40px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 20px 60px rgba(78, 222, 163, 0.08)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scanner-rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        'breathe': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'telemetry-fade': {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'slide-up': 'slide-up 0.7s ease-out forwards',
        'scanner-rotate': 'scanner-rotate 2s linear infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'telemetry-fade': 'telemetry-fade 0.4s ease-out forwards',
        'blink': 'blink 1.5s ease-in-out infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #4edea3, #10b981)',
      },
    },
  },
  plugins: [],
};
