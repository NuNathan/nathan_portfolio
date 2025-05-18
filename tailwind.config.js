// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',       // For App Router
    './pages/**/*.{js,ts,jsx,tsx}',     // Optional: if using Pages Router
    './components/**/*.{js,ts,jsx,tsx}',// All components
  ],
  plugins: [],
}
