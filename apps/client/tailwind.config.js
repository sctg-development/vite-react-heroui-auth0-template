import {heroui} from "@heroui/theme"
import path from "path"

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/*/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {      
      backgroundImage: {
        'gradient-border-violet': 'linear-gradient(hsl(var(--heroui-background)), hsl(var(--heroui-background))), linear-gradient(83.87deg, #F54180, #9353D3)',
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
}
