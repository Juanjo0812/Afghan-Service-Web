/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
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
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
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
        // Custom design system colors
        cream: {
          DEFAULT: '#FAF7F2',
          dark: '#F0EBE0',
        },
        forest: {
          DEFAULT: '#2B3A2E',
          light: '#4A5E4A',
          dark: '#1A2518',
        },
        amber: {
          DEFAULT: '#C68B2B',
          light: '#F5E6C8',
          dark: '#A07020',
        },
        olive: {
          DEFAULT: '#8A9B7E',
          light: '#E8DCC8',
        },
        warm: {
          sand: '#E8DCC8',
        },
        error: {
          DEFAULT: '#C44B3A',
        },
        success: {
          DEFAULT: '#4A7C59',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['"Noto Sans Arabic"', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['3.25rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-l': ['2.625rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'heading-1': ['2.25rem', { lineHeight: '1.2' }],
        'heading-2': ['1.875rem', { lineHeight: '1.25' }],
        'heading-3': ['1.5rem', { lineHeight: '1.3' }],
        'heading-4': ['1.25rem', { lineHeight: '1.4' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body': ['1rem', { lineHeight: '1.7' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6' }],
        'label': ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.04em' }],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '96px',
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        'card': '0 1px 3px rgba(43, 58, 46, 0.06)',
        'card-hover': '0 4px 12px rgba(43, 58, 46, 0.08)',
        'dropdown': '0 8px 24px rgba(43, 58, 46, 0.12)',
      },
      maxWidth: {
        'container': '1200px',
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
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "fade-in": "fade-in 0.6s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}