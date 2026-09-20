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
        // Deep blue — exact icon color #003A68
        brand: {
          50:  '#EAF1F7',
          100: '#CBDCE9',
          200: '#9EBEDA',
          300: '#6D9BC5',
          400: '#3E76AC',
          500: '#1D5990',
          600: '#0F4677',
          700: '#003A68',
          800: '#002C51',
          900: '#001E38',
          950: '#00131F',
        },

        // Warm orange — exact icon color #F4990D
        accent: {
          50:  '#FEF6E7',
          100: '#FDE8BF',
          200: '#FBD794',
          300: '#F9C669',
          400: '#F7B33F',
          500: '#F4990D',
          600: '#D57F09',
          700: '#AC6407',
          800: '#824B05',
          900: '#583203',
          950: '#331D02',
        },

        ink: {
          50:  '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },

        status: {
          available: '#16A34A',
          pending: '#F4990D',
          taken: '#94A3B8',
          error: '#DC2626',
        },
      },

      boxShadow: {
        card:      '0 1px 2px rgba(0,58,104,0.04), 0 8px 24px -8px rgba(0,58,104,0.10)',
        cardHover: '0 4px 8px rgba(0,58,104,0.06), 0 18px 40px -12px rgba(0,58,104,0.18)',
        soft:      '0 1px 3px rgba(0,58,104,0.06), 0 1px 2px rgba(0,58,104,0.04)',
        brand:      '0 4px 14px rgba(0,58,104,0.18)',
        brandHover: '0 8px 24px rgba(0,58,104,0.25)',
        accent:      '0 4px 14px rgba(244,153,13,0.20)',
        accentHover: '0 8px 24px rgba(244,153,13,0.30)',

        // Glassmorphism shadows — soft, diffused, low opacity
        glass:      '0 8px 32px rgba(0,58,104,0.10), inset 0 1px 0 rgba(255,255,255,0.4)',
        glassHover: '0 12px 40px rgba(0,58,104,0.16), inset 0 1px 0 rgba(255,255,255,0.5)',
        glassDark:  '0 8px 32px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.08)',
      },

      backdropBlur: {
        xs: '2px',
      },

      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },

      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
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
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 4px 14px rgba(244,153,13,0.20)' },
          '50%': { boxShadow: '0 8px 28px rgba(244,153,13,0.40)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },

      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.4s ease both',
        'scale-in': 'scale-in 0.25s cubic-bezier(0.16,1,0.3,1) both',
        'toast-in': 'toast-in 0.3s cubic-bezier(0.16,1,0.3,1) both',
        shimmer: 'shimmer 1.4s infinite',
        'glow-pulse': 'glow-pulse 2.5s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
      },
    },
  },

  plugins: [],
}
