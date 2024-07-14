/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'dark': '#1a202c',
      },
      textColor: {
        'dark': '#e2e8f0',
      },
    },
  },
  plugins: [],
}
