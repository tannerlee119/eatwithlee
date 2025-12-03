import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Refined, more neutral-leaning palette
        primary: {
          DEFAULT: '#EA580C', // Orange-600 - Deep, professional orange
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#334155', // Slate-700
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#F1F5F9', // Slate-100
          foreground: '#0F172A',
        },
        background: '#FFFFFF',
        surface: '#F8FAFC', // Slate-50
        border: '#E2E8F0', // Slate-200
        muted: '#64748B', // Slate-500
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.03)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
      },
    },
  },
  plugins: [],
}
export default config
