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
        serif: ["Instrument Serif", "Georgia", "serif"],
        mono: ["Geist Mono", "monospace"],
      },
      colors: {
        ink: "#0A0A0A",
        paper: "#FFFFFF",
        border: "#E5E5E5",
        muted: "#A0A0A0",
        hover: "#F5F5F5",
      },
    },
  },
  plugins: [],
};
export default config;
