/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        background: "#120316",
        purple: "#371641",
        darkPurple: "#24062C",
        yellow: "#F39F5A",
        pink: "#AE445A",
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};
