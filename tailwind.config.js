/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        clay: "#fef3c7",
        ember: "#ea580c",
        ocean: "#0ea5e9",
      },
      fontFamily: {
        body: ["'Space Grotesk'", "sans-serif"],
        display: ["'Merriweather'", "serif"],
      },
      boxShadow: {
        card: "0 10px 35px rgba(15, 23, 42, 0.08)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        rise: "rise 400ms ease-out both",
      },
    },
  },
  plugins: [],
};