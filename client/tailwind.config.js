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
        base: "0.9375rem",
      },
      lineHeight: {
        12: "3rem",
      },
      colors: {
        primary: "#252525",
        secondary: "#FFFDFB",
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/line-clamp")],
};
