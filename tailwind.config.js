/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        elder: {
          green: '#15803d',
          darkgreen: '#14532d',
          yellow: '#facc15',
          cream: '#fefce8',
          blue: '#1d4ed8',
          amber: '#d97706',
          rose: '#e11d48'
        }
      },
      fontSize: {
        'elder-xl': ['1.75rem', { lineHeight: '2.25rem' }],
        'elder-2xl': ['2.25rem', { lineHeight: '2.75rem' }],
        'elder-3xl': ['3rem', { lineHeight: '3.5rem' }],
        'elder-4xl': ['3.75rem', { lineHeight: '4.25rem' }],
      }
    },
  },
  plugins: [],
}

