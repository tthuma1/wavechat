/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          750: "#313a4a",
          850: "#161e2e",
        },
      },
    },
  },
  plugins: [],
};
