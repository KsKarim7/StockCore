import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
      },
      fontSize: {
        'page-title': ['22px', { lineHeight: '1.3', fontWeight: '700' }],
        'section-heading': ['16px', { lineHeight: '1.4', fontWeight: '600' }],
        'table-header': ['13px', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '0.05em' }],
        'table-body': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'badge': ['12px', { lineHeight: '1.3', fontWeight: '500' }],
      },
      colors: {
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
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        status: {
          confirmed: "hsl(var(--status-confirmed))",
          "confirmed-bg": "hsl(var(--status-confirmed-bg))",
          paid: "hsl(var(--status-paid))",
          "paid-bg": "hsl(var(--status-paid-bg))",
          partial: "hsl(var(--status-partial))",
          "partial-bg": "hsl(var(--status-partial-bg))",
          cancelled: "hsl(var(--status-cancelled))",
          "cancelled-bg": "hsl(var(--status-cancelled-bg))",
          returned: "hsl(var(--status-returned))",
          "returned-bg": "hsl(var(--status-returned-bg))",
          instock: "hsl(var(--status-instock))",
          "instock-bg": "hsl(var(--status-instock-bg))",
          lowstock: "hsl(var(--status-lowstock))",
          "lowstock-bg": "hsl(var(--status-lowstock-bg))",
          outofstock: "hsl(var(--status-outofstock))",
          "outofstock-bg": "hsl(var(--status-outofstock-bg))",
        },
        "row-hover": "hsl(var(--row-hover))",
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
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
