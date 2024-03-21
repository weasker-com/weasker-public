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
        "weasker-black": "#0C0117",
        "weasker-grey": "#757575",
        "weasker-light-grey": "#D9D9D9",
        "weasker-green-gradient":
          "linear-gradient(90deg, #00453E 0%, rgba(25, 88, 81, 0.75) 99.44%)",
        "tl-dark-blue": "#253c4c",
        "tl-light-blue": "#007BFF",
      },
    },
    fontSize: {
      // name: ["font-size", "line-height"]
      xs: ["12px", "15px"],
      sm: ["14px", "20px"],
      base: ["16px", "25px"],
      lg: ["20px", "24px"],
      xl: ["25px", "30px"],
      "2xl": ["28px", "32px"],
      "3xl": ["30px", "40px"],
      "4xl": ["35px", "50px"],
      "5xl": ["40px", "50px"],
    },
    scale: {
      "-100": "-1",
    },
  },
  plugins: [],
};
export default config;
