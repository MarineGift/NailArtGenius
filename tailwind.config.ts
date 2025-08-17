import type { Config } from "tailwindcss";

const config: Config = {
  content: ['./app/**/*.{ts,tsx,mdx}', './components/**/*.{ts,tsx}', './pages/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {}
  },
  plugins: [],
};

export default config;
