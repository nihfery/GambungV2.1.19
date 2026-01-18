/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // penting kalau pakai kelas "dark:"
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,.06), 0 4px 12px rgba(0,0,0,.04)", // <-- inilah 'shadow-card'
      },
    },
  },
  plugins: [],
}
