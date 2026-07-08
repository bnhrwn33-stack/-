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
        // ערוצי gold-* מוזנים ממשתני CSS כדי לתמוך בהחלפת accent חיה (ראה UiContext)
        gold: {
          300: 'rgb(var(--gold-300-rgb) / <alpha-value>)',
          400: 'rgb(var(--gold-400-rgb) / <alpha-value>)',
          500: 'rgb(var(--gold-500-rgb) / <alpha-value>)',
          600: 'rgb(var(--gold-600-rgb) / <alpha-value>)',
          700: 'rgb(var(--gold-700-rgb) / <alpha-value>)',
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
        glow: '0 0 40px -8px rgb(var(--gold-500-rgb) / 0.35)',
      },
      backgroundImage: {
        'hero-fade':
          'linear-gradient(to top, #050507 0%, rgba(5,5,7,0.65) 35%, rgba(5,5,7,0.35) 60%, rgba(5,5,7,0.75) 100%)',
      },
    },
  },
  plugins: [],
};
