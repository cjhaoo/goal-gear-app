/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0F172A',
        card: '#1A2444',
        border: '#2E3F5F',
        text: '#E8ECEF',
        accentBlue: '#3B82F6',
        accentGreen: '#10B981',
      },
    },
  },
  plugins: [],
};
