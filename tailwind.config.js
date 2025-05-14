// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',       // For App Router
    './pages/**/*.{js,ts,jsx,tsx}',     // Optional: if using Pages Router
    './components/**/*.{js,ts,jsx,tsx}',// All components
  ],
  theme: {
    extend: {
      keyframes: {
        morph: {
          '0%': {
            borderRadius: '42% 58% 30% 70% / 30% 30% 70% 70%',
          },
          '25%': {
            borderRadius: '60% 40% 30% 70% / 60% 20% 80% 40%',
          },
          '50%': {
            borderRadius: '30% 70% 70% 30% / 30% 60% 40% 70%',
          },
          '75%': {
            borderRadius: '45% 55% 65% 35% / 40% 40% 60% 60%',
          },
          '100%': {
            borderRadius: '42% 58% 30% 70% / 30% 30% 70% 70%',
          },
        },
      },
      animation: {
        morph: 'morph 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
