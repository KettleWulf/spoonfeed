import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "tall-xl": { raw: "(min-height: 1200px)" },
      },
    },
  },
  plugins: [],
} satisfies Config;