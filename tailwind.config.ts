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
        "kawaii-pink": "#FFD1DC",
        "kawaii-blue": "#B4E4FF",
        "kawaii-yellow": "#FFF9C4",
        "kawaii-green": "#C1E1C1",
        "kawaii-lavender": "#E0BBE4",
        "kawaii-cream": "#FFFDF9",
        "princeton-orange": {
          50: '#fdf1e7',
          100: '#fbe3d0',
          200: '#f8c6a0',
          300: '#f4aa71',
          400: '#f18d41',
          500: '#ed7112', // On garde l'orange scout mais on l'utilisera par petites touches
          600: '#be5a0e',
        },
        primary: {
          DEFAULT: '#ed7112',
          foreground: '#ffffff',
        },
      },
      borderRadius: {
        lg: "1.5rem",
        md: "1rem",
        sm: "0.75rem",
      },
      transitionTimingFunction: {
        "kawaii-bounce": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
