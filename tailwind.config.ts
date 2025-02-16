import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        lightMain: "#ffe701",
        lightSub: "#fff8af",
        lightBackgraund: "#fffcdc",
        lightText: "#fff",
        darkMain: "#0018fe",
        darkSub: "#2c2e41",
        darkBackgraund: "#000d8c",
        darkText: "#000",
        button: "#00AE1C",
        currentDay: "#DFF5E2",
      },
    },
  },
  plugins: [],
} satisfies Config;
