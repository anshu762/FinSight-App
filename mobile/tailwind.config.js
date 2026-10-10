/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          dark: "#4338CA",
          soft: "#EEF2FF",
        },
        topic: {
          stocks: "#3B82F6",
          investing: "#10B981",
          taxes: "#F59E0B",
          crypto: "#8B5CF6",
        },
        background: "#F8FAFC",
        surface: "#FFFFFF",
        text: "#0F172A",
        muted: "#64748B",
        border: "#E2E8F0",
        success: "#10B981",
        danger: "#EF4444",
        warning: "#F59E0B",
      },
      borderRadius: {
        card: "16px",
        button: "14px",
        input: "14px",
        chip: "9999px",
      },
      spacing: {
        screen: "20px",
        touch: "44px",
        "btn-h": "52px",
        "input-h": "52px",
      },
    },
  },
  plugins: [],
};
