import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#060913",
        panel: "#0c1220",
        panel2: "#111827",
        border: "#223047",
        teal: "#2dd4bf",
        violet: "#a78bfa",
        danger: "#fb7185",
        warning: "#fbbf24",
        success: "#34d399"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(45,212,191,0.18), 0 24px 80px rgba(0,0,0,0.35)"
      }
    }
  },
  plugins: []
};

export default config;
