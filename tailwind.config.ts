import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        textC: "#444746",
        textC2: "#4285F4",
        bgc: "#F7F9FC",
        darkC2: "#EDF2FC",
        darkC: "#E1E5EA",
      },
    },
    screens: {
      tablet: "840px",
    },
  },
  plugins: [],
} satisfies Config;
