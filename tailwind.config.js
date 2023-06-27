/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["dist/*.html"],
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: false,
    darkTheme: "light",
  },
};
