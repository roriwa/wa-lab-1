/** @type {import('tailwindcss').Config} */
export default {
  content: [
      "./index.html",
      "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'color-change': `colorChange 100ms forwards`
      },
      keyframes: {
        colorChange: {
          '50%': { backgroundColor: "red" },
          '100%': { backgroundColor: "black" },
        }
      }
    },
  },
  plugins: [],
}

