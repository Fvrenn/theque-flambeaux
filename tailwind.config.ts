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
        "princeton-orange": {
          50: '#fdf1e7',
          100: '#fbe3d0',
          200: '#f8c6a0',
          300: '#f4aa71',
          400: '#f18d41',
          500: '#ed7112',
          600: '#be5a0e',
          700: '#8e440b',
          800: '#5f2d07',
          900: '#2f1704',
          950: '#211002',
        },
        primary: {
          DEFAULT: '#ed7112',
          foreground: '#ffffff',
        },
      },
    },
  },
  plugins: [],
};

export default config;
