/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#050507',
          900: '#0a0a0e',
          800: '#111117',
          700: '#1a1a22',
          600: '#24242e',
        },
        gold: {
          300: '#f0d99a',
          400: '#e3c46e',
          500: '#c9a84c',
          600: '#a8863a',
          700: '#7d6229',
        },
        steel: {
          200: '#d9dde3',
          300: '#b9bfc9',
          400: '#8e96a3',
          500: '#6b7280',
        },
      },
      fontFamily: {
        hebrew: ['"Heebo"', 'system-ui', 'sans-serif'],
        display: ['"Cinzel"', '"Heebo"', 'serif'],
      },
      boxShadow: {
        card: '0 10px 40px -12px rgba(0,0,0,0.8)',
        glow: '0 0 40px -8px rgba(201,168,76,0.35)',
      },
      backgroundImage: {
        'hero-fade':
          'linear-gradient(to top, #050507 0%, rgba(5,5,7,0.65) 35%, rgba(5,5,7,0.35) 60%, rgba(5,5,7,0.75) 100%)',
      },
    },
  },
  plugins: [],
};
