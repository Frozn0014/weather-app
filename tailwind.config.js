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
      }
    },
  },
  darkMode: 'class',
  plugins: [require('tailwindcss-elevation')]
};
