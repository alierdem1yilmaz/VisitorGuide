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
          50: "#eaf6f5",
          100: "#c9e8e6",
          200: "#96d2ce",
          300: "#5fb6b0",
          400: "#2e9994",
          500: "#0e7c7b",
          600: "#0c6b6b",
          700: "#134e5e",
          800: "#0d3844",
          900: "#08262e",
        },
        accent: {
          50: "#fef6ec",
          400: "#f5bc72",
          500: "#f2a541",
          600: "#dd8e24",
        },
        muted: "#6b8f8e",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
