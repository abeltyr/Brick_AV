import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        "3xsm": "360px",
        // => @media (min-width: 360px) { ... }
        "2xsm": "480px",
        // => @media (min-width: 420px) { ... }
        xsm: "540px",
        // => @media (min-width: 420px) { ... }
        sm: "640px",
        // => @media (min-width: 640px) { ... }
        md: "768px",
        // => @media (min-width: 768px) { ... }
        lg: "1024px",
        // => @media (min-width: 1024px) { ... }
        xl: "1280px",
        // => @media (min-width: 1280px) { ... }
        "2xl": "1440px",
        // => @media (min-width: 1440px) { ... }
        "3xl": "1950px",
        // => @media (min-width: 1440px) { ... }
        "4xl": "2450px",
        // => @media (min-width: 1440px) { ... }
      },
      colors: {
        border: "hsla(var(--border) / <alpha-value>)",
        input: "hsla(var(--input) / <alpha-value>)",
        ring: "hsla(var(--ring) / <alpha-value>)",
        background: "hsla(var(--background) / <alpha-value>)",
        foreground: "hsla(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsla(var(--primary) / <alpha-value>)",
          foreground: "hsla(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsla(var(--secondary) / <alpha-value>)",
          foreground: "hsla(var(--secondary-foreground) / <alpha-value>)",
        },
        tertiary: {
          DEFAULT: "hsla(var(--tertiary) / <alpha-value>)",
          // foreground: "hsla(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsla(var(--destructive) / <alpha-value>)",
          foreground: "hsla(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsla(var(--muted) / <alpha-value>)",
          foreground: "hsla(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsla(var(--accent) / <alpha-value>)",
          foreground: "hsla(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsla(var(--popover) / <alpha-value>)",
          foreground: "hsla(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsla(var(--card) / <alpha-value>)",
          foreground: "hsla(var(--card-foreground) / <alpha-value>)",
        },
        shadow: {
          DEFAULT: "hsla(var(--shadow) / <alpha-value>)",
        },
        neutral: {
          25: "hsla(var(--neutral-25) / <alpha-value>)",
          50: "hsla(var(--neutral-50) / <alpha-value>)",
          100: "hsla(var(--neutral-100) / <alpha-value>)",
          200: "hsla(var(--neutral-200) / <alpha-value>)",
          300: "hsla(var(--neutral-300) / <alpha-value>)",
          400: "hsla(var(--neutral-400) / <alpha-value>)",
          500: "hsla(var(--neutral-500) / <alpha-value>)",
          600: "hsla(var(--neutral-600) / <alpha-value>)",
          700: "hsla(var(--neutral-700) / <alpha-value>)",
          800: "hsla(var(--neutral-800) / <alpha-value>)",
          900: "hsla(var(--neutral-900) / <alpha-value>)",
        },
        stone: {
          50: "hsla(var(--stone-50) / <alpha-value>)",
          100: "hsla(var(--stone-100) / <alpha-value>)",
          200: "hsla(var(--stone-200) / <alpha-value>)",
          300: "hsla(var(--stone-300) / <alpha-value>)",
          400: "hsla(var(--stone-400) / <alpha-value>)",
          500: "hsla(var(--stone-500) / <alpha-value>)",
          600: "hsla(var(--stone-600) / <alpha-value>)",
          700: "hsla(var(--stone-700) / <alpha-value>)",
          800: "hsla(var(--stone-800) / <alpha-value>)",
          900: "hsla(var(--stone-900) / <alpha-value>)",
          950: "hsla(var(--stone-950) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
