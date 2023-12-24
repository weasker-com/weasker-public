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
        "weasker-grey": "#757575",
        "weasker-green-gradient":
          "linear-gradient(90deg, #00453E 0%, rgba(25, 88, 81, 0.75) 99.44%)",
      },
    },
    fontSize: {
      // name: ["font-size", "line-height"]
      xs: ["12px", "15px"],
      sm: ["16px", "27px"],
      base: ["18px", "30px"],
      lg: ["20px", "28px"],
      xl: ["25px", "30px"],
      "2xl": ["28px", "32px"],
      "3xl": ["30px", "40px"],
      "4xl": ["38px", "50px"],
      "5xl": ["45px", "67px"],
    },
    scale: {
      "-100": "-1",
    },
  },
  plugins: [],
};
export default config;
