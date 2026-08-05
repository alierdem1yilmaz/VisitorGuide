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
          50: "#f7f1e8",
          100: "#ede0cc",
          200: "#dec7a0",
          300: "#c9a873",
          400: "#ad8452",
          500: "#8c6239",
          600: "#6f4a2a",
          700: "#55381f",
          800: "#3a2515",
          900: "#211408",
        },
        accent: {
          50: "#fbf3e3",
          400: "#d9a63d",
          500: "#c08b26",
          600: "#9c6e17",
        },
        muted: "#8a7968",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
