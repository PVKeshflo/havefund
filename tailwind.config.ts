import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
        outfit: ["var(--font-outfit)", "sans-serif"],
        mono: ["Geist Mono", "monospace"],
      },
      colors: {
        ink: "#0A0A0A",
        paper: "#FFFFFF",
        border: "#E5E5E5",
        muted: "#555555",
        hover: "#F5F5F5",
        accent: "#DC2626",
      },
    },
  },
  plugins: [],
};
export default config;
