import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{vue,ts,tsx,js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: "0",
      screens: {
        DEFAULT: "1200px",
        sm: "1200px",
        md: "1200px",
        lg: "1200px",
        xl: "1200px",
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        heading: "rgb(var(--color-heading) / <alpha-value>)",
        text: "rgb(var(--color-text) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        subtle: "rgb(var(--color-subtle) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
        panel: "rgb(var(--color-panel) / <alpha-value>)",
        nav: "rgb(var(--color-nav) / <alpha-value>)",
        hairline: "rgb(var(--color-hairline) / <alpha-value>)",
        divider: "rgb(var(--color-divider) / <alpha-value>)",
        slider: "rgb(var(--color-slider) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        "link-blue": "rgb(var(--color-link-blue) / <alpha-value>)",
        "footer-bg": "rgb(var(--color-footer-bg) / <alpha-value>)",
      },
      fontFamily: {
        sans: [
          '"Inter"',
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        contact: "0 6px 16px rgb(16 24 40 / 16%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
