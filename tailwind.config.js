/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        accent: "#FF6B4A",
        bg: "#FAFAF8",
        surface: "#FFFFFF",
        text: "#1A1A1A",
        muted: "#8A8A8A",
      },
    },
  },
  plugins: [],
};
