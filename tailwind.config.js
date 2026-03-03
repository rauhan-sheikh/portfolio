/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        secondary: "rgb(var(--secondary) / <alpha-value>)",
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          hover: "rgb(var(--accent-hover) / <alpha-value>)",
        },
        border: "rgb(var(--border) / <alpha-value>)",
      },
      fontFamily: {
        heading: ['"IBM Plex Mono"', "monospace"],
        body: ['"IBM Plex Mono"', "monospace", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
      },
      maxWidth: {
        "4xl": "56rem",
      },
      spacing: {
        96: "24rem",
      },
    },
  },
  plugins: [],
};
