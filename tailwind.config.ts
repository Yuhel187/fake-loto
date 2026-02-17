import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tet: {
          red: "#D32F2F",
          gold: "#FFD700",
          yellow: "#FFFF00",
          cream: "#FFFDD0",
        },
      },
      backgroundImage: {
        'tet-pattern': "url('/tet-bg.svg')", // Placeholder, we will use CSS gradient for now
      },
      animation: {
        'drop': 'drop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        drop: {
          '0%': { transform: 'scale(1.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
