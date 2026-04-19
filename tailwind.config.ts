import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "pop-in": {
          "0%": { transform: "scale(0.3) rotate(-10deg)", opacity: "0" },
          "60%": { transform: "scale(1.15) rotate(3deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        "float-fade": {
          "0%": { transform: "scale(1) translateY(0)", opacity: "1" },
          "100%": { transform: "scale(1.4) translateY(-80px)", opacity: "0" },
        },
        "pulse-big": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.08)" },
        },
        "float-fade-slow": {
          "0%":   { transform: "translateY(0)",      opacity: "0" },
          "12%":  { transform: "translateY(-10px)",  opacity: "1" },
          "78%":  { transform: "translateY(-65px)",  opacity: "1" },
          "100%": { transform: "translateY(-90px)",  opacity: "0" },
        },
      },
      animation: {
        "pop-in": "pop-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "float-fade": "float-fade 1.2s ease-out forwards",
        "pulse-big": "pulse-big 0.8s ease-in-out infinite",
        "float-fade-slow": "float-fade-slow 7s ease-in-out forwards",
        "baby-fall": "baby-fall var(--fall-duration,3.5s) ease-in var(--fall-delay,0s) forwards",
        "gong-overlay": "gong-overlay 2s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
