/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#030712',
          900: '#080d1a',
          850: '#0c1326',
          800: '#111a33',
          750: '#172242',
          700: '#1e2b54',
          600: '#2a3b73',
          500: '#3b529a'
        },
        cyan: {
          350: '#4be0e0',
          450: '#17c5d4',
          550: '#0ea5b5'
        },
        telemetry: {
          emerald: '#10b981',
          amber: '#f59e0b',
          crimson: '#ef4444',
          cyan: '#06b6d4',
          violet: '#8b5cf6',
          blue: '#3b82f6'
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif']
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'sweep 4s linear infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        sweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(6, 182, 212, 0.4)' },
          '100%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.8)' }
        }
      }
    },
  },
  plugins: [],
}
