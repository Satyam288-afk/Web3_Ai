import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#020407",
        panel: "#070b12",
        panel2: "#0b1220",
        border: "#1e293b",
        ink: "#e5edf8",
        muted: "#8290a3",
        teal: "#0891b2",
        violet: "#7357d9",
        coral: "#ea715f",
        danger: "#d94b58",
        warning: "#b7791f",
        success: "#22d3ee"
      },
      boxShadow: {
        glow: "0 1px 2px rgba(15,23,42,0.5), 0 18px 50px rgba(8,145,178,0.10)",
        lift: "0 10px 30px rgba(8,145,178,0.12)"
      }
    }
  },
  plugins: []
};

export default config;
