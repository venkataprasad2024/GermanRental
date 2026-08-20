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
        /*
         * GermanRental Slate Blue Theme
         * Trust-forward, marketplace-credible primary palette
         */
        brand: {
          50: '#F4F7FF',
          100: '#E1E9FE',
          200: '#C3D3FC',
          300: '#9BB4F8',
          400: '#6D8CF0',
          500: '#3F63E0',
          600: '#2B47B8',
          700: '#22368F',
          800: '#1A2967',
          900: '#131E4A',
          950: '#0C1430',
        },

        /*
         * Neutral / text palette
         * Kept from the original design for readability
         */
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

        /*
         * Accent — warm orange for CTAs and highlights
         * Pairs with the slate blue brand color for contrast on
         * primary actions like "Jetzt anfragen" / "Besichtigung buchen"
         */
        accent: {
          50: '#FFF4EE',
          100: '#FFE3D2',
          200: '#FFC5A3',
          300: '#FFA06A',
          400: '#FF7A3D',
          500: '#F45A1C',
          600: '#D5430E',
          700: '#AC330B',
          800: '#84280C',
          900: '#5E1D0A',
          950: '#3A1206',
        },

        /*
         * Status colors for listing states
         * Kept separate from brand/accent so they never compete visually
         */
        status: {
          available: '#2E8B57',
          pending: '#E7B10A',
          taken: '#9AA3B5',
        },
      },

      boxShadow: {
        card:
          '0 1px 2px rgba(16,24,40,0.04), 0 8px 24px -8px rgba(16,24,40,0.10)',

        cardHover:
          '0 4px 8px rgba(16,24,40,0.06), 0 18px 40px -12px rgba(16,24,40,0.18)',

        soft:
          '0 1px 3px rgba(16,24,40,0.06), 0 1px 2px rgba(16,24,40,0.04)',

        /*
         * Blue glow for important UI elements
         */
        brand:
          '0 4px 14px rgba(63,99,224,0.18)',

        brandHover:
          '0 8px 24px rgba(63,99,224,0.25)',

        /*
         * Orange glow for CTA buttons
         */
        accent:
          '0 4px 14px rgba(244,90,28,0.20)',

        accentHover:
          '0 8px 24px rgba(244,90,28,0.28)',
      },

      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },

      keyframes: {
        'fade-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(12px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },

        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },

        'scale-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.97)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },

        'toast-in': {
          '0%': {
            opacity: '0',
            transform: 'translateX(24px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },

        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      },

      animation: {
        'fade-up':
          'fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both',

        'fade-in':
          'fade-in 0.4s ease both',

        'scale-in':
          'scale-in 0.25s cubic-bezier(0.16,1,0.3,1) both',

        'toast-in':
          'toast-in 0.3s cubic-bezier(0.16,1,0.3,1) both',

        shimmer:
          'shimmer 1.4s infinite',
      },
    },
  },

  plugins: [],
}