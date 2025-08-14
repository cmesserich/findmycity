/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Wire to next/font variable, then fall back
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui", "Helvetica Neue", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
