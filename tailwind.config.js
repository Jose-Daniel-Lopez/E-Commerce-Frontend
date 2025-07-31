/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        figtree: "var(--font-figtree)",
        srProDisplay: "var(--font-srProDisplay)",
      },
      screens: {
        xs: "420px",
      },
    },
  },
  plugins: [],
}
