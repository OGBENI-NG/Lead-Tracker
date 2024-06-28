/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,html,css}",
    "./index.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        Nunito: ["Nunito", 'sans-serif']
      },
      colors: {
        brand: "#e05d1f",
        darkest: "#191919",
        dark: "#484848",
        mid: "#7eaf77",
        light: "#e3c89b",
        lightest: "#f4e8d3"
      }
    },
  },
  plugins: [],
}
