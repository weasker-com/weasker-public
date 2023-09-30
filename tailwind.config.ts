import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "tl-dark-blue": "#253c4c",
        "tl-light-blue": "#007BFF",
      },
    },
    fontSize: {
      xs: ["12px", "15px"],
      sm: ["16px", "27px"],
      base: ["18px", "30px"],
      lg: ["20px", "28px"],
      xl: ["25px", "38px"],
      "2xl": ["28px", "32px"],
      "3xl": ["30px", "40px"],
      "4xl": ["38px", "50px"],
      "5xl": ["45px", "67px"],
    },
  },
  plugins: [],
};
export default config;
