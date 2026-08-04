import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eafaf7",
          100: "#c9f0e8",
          200: "#94e0d1",
          300: "#5cc9b8",
          400: "#2fae9e",
          500: "#128f82",
          600: "#0d7268",
          700: "#0a5750",
          800: "#08423d",
          900: "#06322f",
        },
        accent: {
          50: "#fff7ed",
          400: "#fb923c",
          500: "#f2932c",
          600: "#ea7c1a",
        },
        muted: "#5b7671",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
