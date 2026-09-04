/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0C0D0F',
        steel: '#17191D',
        chalk: '#F4F4F2',
        volt: '#D8FF3E',
        rust: '#E4572E',
      },
      fontFamily: {
        display: ['"Anton"', '"Arial Narrow"', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
