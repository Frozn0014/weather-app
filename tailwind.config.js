/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{html,vue,js,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif']
      },
      colors: {
        light: '#bae6fd',
        dark: '#2b2b2b'
      },
      backgroundImage: {
        'gradient-dark': "#000"
      }
    },
  },
  darkMode: 'class',
  plugins: [require('tailwindcss-elevation'), require('tailwind-border-gradients'), require('tailwindcss-gradient-text')]
};
