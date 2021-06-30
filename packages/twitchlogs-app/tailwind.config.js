const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    zIndex: {
      1000: 1000,
      1010: 1010,
      1020: 1020,
    },
    extend: {
      transitionDuration: {
        0: "0ms",
        300: "300ms",
        500: "500ms",
        1000: "1000ms",
        2000: "2000ms",
      },
      colors: {
        primary: "var(--color-primary)",
        darkLight: "var(--color-dark-light)",
        darkDark: "var(--color-dark-dark)",
        warning: colors.yellow[500],
        info: colors.indigo[600],
        success: colors.green[500],
        error: colors.red[500],
      },
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/forms"), require("tailwind-scrollbar")],
};
