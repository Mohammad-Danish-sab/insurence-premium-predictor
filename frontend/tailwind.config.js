/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A5F", // dark blue
        secondary: "#2E86AB", // light blue
        accent: "#F4A261", // orange
        success: "#2DC653", // green
        danger: "#E63946", // red
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
