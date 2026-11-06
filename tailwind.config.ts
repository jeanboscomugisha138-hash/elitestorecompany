import type { Config } from "tailwindcss";

// Keep existing palette-based status styles in sync with the shared theme.
const themedPalette = {
  50: 'hsl(var(--muted))',
  100: 'hsl(var(--accent))',
  200: 'hsl(var(--accent-foreground))',
  300: 'hsl(var(--primary))',
  400: 'hsl(var(--primary))',
  500: 'hsl(var(--primary))',
  600: 'hsl(var(--primary))',
  700: 'hsl(var(--accent-foreground))',
  800: 'hsl(var(--foreground))',
  900: 'hsl(var(--primary-foreground))',
  950: 'hsl(var(--background))',
};

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        blue: themedPalette,
        cyan: themedPalette,
        sky: themedPalette,
        teal: themedPalette,
        green: themedPalette,
        emerald: themedPalette,
        amber: themedPalette,
        yellow: themedPalette,
        orange: themedPalette,
        red: themedPalette,
        rose: themedPalette,
        pink: themedPalette,
        purple: themedPalette,
        violet: themedPalette,
        indigo: themedPalette,
        slate: themedPalette,
        gray: themedPalette,
        neutral: themedPalette,
        zinc: themedPalette,
        white: 'hsl(var(--foreground))',
        black: 'hsl(var(--background))',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        success: { DEFAULT: "hsl(var(--success))", foreground: "hsl(var(--success-foreground))" },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
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
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 hsl(var(--primary) / 0.6), 0 0 20px 0 hsl(var(--success) / 0.4)" },
          "50%": { boxShadow: "0 0 0 12px hsl(var(--primary) / 0), 0 0 30px 6px hsl(var(--success) / 0.6)" },
        },
        "pulse-success": {
          "0%, 100%": { boxShadow: "0 0 0 0 hsl(var(--success) / 0.55), 0 8px 20px -6px hsl(var(--success) / 0.5)" },
          "50%": { boxShadow: "0 0 0 12px hsl(var(--success) / 0), 0 10px 26px -6px hsl(var(--success) / 0.6)" },
        },
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 0 0 hsl(var(--primary) / 0.6), 0 8px 22px -6px hsl(var(--primary) / 0.55)" },
          "50%": { boxShadow: "0 0 0 12px hsl(var(--primary) / 0), 0 12px 28px -6px hsl(var(--success) / 0.7)" },
        },
        "shine": {
          "0%": { transform: "translateX(-120%)" },
          "60%, 100%": { transform: "translateX(220%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "pulse-success": "pulse-success 2s ease-in-out infinite",
        "pulse-gold": "pulse-gold 1.8s ease-in-out infinite",
        "shine": "shine 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
