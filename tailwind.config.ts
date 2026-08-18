import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171717",
        paper: "#111111",
        ember: "#f5f5f4",
        moss: "#72bc8f",
        sand: "#262626",
      },
      boxShadow: { soft: "0 10px 30px rgba(0,0,0,.18)" },
    },
  },
  plugins: [],
} satisfies Config;
