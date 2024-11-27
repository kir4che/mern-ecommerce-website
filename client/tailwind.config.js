/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "490px",
        sm: "652px",
      },
      minHeight: {
        screenwithh: "calc(100vh - 4rem)",
      },
      maxWidth: {
        100: "25rem",
      },
      minWidth: {
        76: "19rem",
      },
      width: {
        22: "5.5rem",
        88: "22rem",
        100: "25rem",
      },
      height: {
        18: "4.5rem",
        22: "5.5rem",
      },
      padding: {
        0.25: "0.0625rem",
        0.75: "0.1875rem",
      },
      backgroundImage: {
        "about-cover": "url('/src/assets/images/about/about-cover.jpg')",
      },
      fontSize: {
        "6xl": "calc(2.625rem + 1vw)",
        "5xl": "calc(2.875rem + 0.25vw)",
        "4.5xl": "calc(2rem + 0.5vw)",
        "4xl": "calc(1.75rem + 0.6vw)",
        "3xl": "calc(1.25rem + 1vw)",
        "2.5xl": "calc(1rem + 1vw)",
        xxs: "calc(0.5rem + 0.25vw)",
        base: "0.9375rem",
      },
      colors: {
        primary: "#252525",
        secondary: "#FFFDFB",
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/line-clamp")],
};
