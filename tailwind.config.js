/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9ecff',
          200: '#bcddff',
          300: '#8ec8ff',
          400: '#59a8ff',
          500: '#3385ff',
          600: '#1d66f5',
          700: '#1651e1',
          800: '#1942b6',
          900: '#1a3c8f',
          950: '#142657',
        },
        ink: {
          50: '#f7f8fa',
          100: '#eef0f4',
          200: '#dde1e9',
          300: '#c2c8d4',
          400: '#9aa3b5',
          500: '#717c93',
          600: '#57607a',
          700: '#454c63',
          800: '#2f3447',
          900: '#1c2030',
          950: '#11131f',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.04), 0 8px 24px -8px rgba(16,24,40,0.10)',
        cardHover: '0 4px 8px rgba(16,24,40,0.06), 0 18px 40px -12px rgba(16,24,40,0.18)',
        soft: '0 1px 3px rgba(16,24,40,0.06), 0 1px 2px rgba(16,24,40,0.04)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.4s ease both',
        'scale-in': 'scale-in 0.25s cubic-bezier(0.16,1,0.3,1) both',
        'toast-in': 'toast-in 0.3s cubic-bezier(0.16,1,0.3,1) both',
        shimmer: 'shimmer 1.4s infinite',
      },
    },
  },
  plugins: [],
}
