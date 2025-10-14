/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{html,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "490px",
        sm: "652px",
      },
      backgroundImage: {
        "about-cover": "url('/src/assets/images/about/about-cover.jpg')",
      },
      colors: {
        primary: "#03101F",
        secondary: "#FFFDFB",
      },
    },
  },
  plugins: [require("daisyui")],
};
