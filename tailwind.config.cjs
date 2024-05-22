/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg": "var(--bg)",
        "color": "var(--color)",
        "disabled": "var(--disabled)",
        "red": "var(--red)",
        "dash": "var(--dash)",

        "accent": "var(--accent)",

      }
    }
  },
  plugins: []
};
