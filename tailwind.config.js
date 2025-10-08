/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        /* Base */
        background: "#0099e6", // hsl(220, 25%, 8%)
        foreground: "#e5f0ff", // hsl(210, 100%, 95%)

        /* Card / Popover */
        card: "#171c28", // hsl(220, 20%, 12%)
        "card-foreground": "#e5f0ff",
        popover: "#171c28",
        "popover-foreground": "#e5f0ff",

        /* Primary / Secondary */
        primary: {
          DEFAULT: "#0099e6", // hsl(200, 100%, 45%)
          foreground: "#0d1320",
        },
        secondary: {
          DEFAULT: "#2e6b2e", // hsl(120, 35%, 25%)
          foreground: "#e5f0ff",
        },

        /* Muted / Accent / Destructive */
        muted: {
          DEFAULT: "#2b3340", // hsl(220, 15%, 20%)
          foreground: "#a3b3cc", // hsl(210, 20%, 65%)
        },
        accent: {
          DEFAULT: "#ffcc33", // hsl(45, 100%, 60%)
          foreground: "#0d1320",
        },
        destructive: {
          DEFAULT: "#e64545", // hsl(0, 75%, 55%)
          foreground: "#e5f0ff",
        },

        /* UI tokens */
        border: "#204060", // hsl(200, 50%, 25%)
        input: "#2b3340",
        ring: "#0099e6", // hsl(200, 100%, 45%)

        /* Pixel art game colors */
        "ocean-deep": "#0a1333", // hsl(220, 80%, 15%)
        "ocean-surface": "#3380b3", // hsl(200, 70%, 35%)
        "ship-hull": "#333333", // hsl(0, 0%, 20%)
        explosion: "#ff5526", // hsl(15, 100%, 50%)
        "hit-marker": "#e64545", // hsl(0, 75%, 55%)
        "miss-marker": "#99bbd9", // hsl(200, 30%, 70%)
      },
      fontFamily: {
        mono: ["JetBrainsMono"],
        "mono-bold": ["JetBrainsMono-bold"],
      },
      borderRadius: {
        lg: 20,
        md: 10,
        sm: 5,
        s: 2,
      },
      keyframes: {
        "pixel-bounce": {
          "0%, 100%": { transform: [{ translateY: 0 }] },
          "50%": { transform: [{ translateY: -4 }] },
        },
        "pixel-pulse": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.7 },
        },
        explosion: {
          "0%": { transform: [{ scale: 0.8 }], opacity: 1 },
          "50%": { transform: [{ scale: 1.2 }], opacity: 0.8 },
          "100%": { transform: [{ scale: 1 }], opacity: 1 },
        },
      },
      animation: {
        "pixel-bounce": "pixel-bounce 1s infinite",
        "pixel-pulse": "pixel-pulse 2s ease-in-out infinite",
        explosion: "explosion 0.5s ease-out",
      },
    },
  },
  plugins: [],
};
