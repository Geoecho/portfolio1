/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B6B', // Red accent from the image
        secondary: '#F5F5F5', // Light gray background
        dark: '#1A1A1A',
      },
      fontFamily: {
        heading: ['"Work Sans"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
