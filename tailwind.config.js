/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: 'var(--color-bg)',
          subtle: 'var(--color-bg-subtle)',
          surface: 'var(--color-bg-surface)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
        },
        fg: {
          DEFAULT: 'var(--color-fg)',
          muted: 'var(--color-fg-muted)',
          subtle: 'var(--color-fg-subtle)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', 'monospace'],
      },
      letterSpacing: {
        curatorial: '0.12em',
        tightest: '-0.035em',
      }
    },
  },
  plugins: [],
}
