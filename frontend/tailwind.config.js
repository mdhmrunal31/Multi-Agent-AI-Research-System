/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"',    'monospace'],
      },
      colors: {
        bg:       '#070810',
        surface:  '#0d0f1a',
        surface2: '#131628',
        border:   '#1e2340',
        border2:  '#252a45',
        purple: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
        },
        orange: {
          400: '#fb923c',
          500: '#f97316',
        },
        pink: {
          400: '#f472b6',
          500: '#ec4899',
        },
      },
      animation: {
        'pulse-slow':  'pulse 2.5s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-up':     'fadeUp 0.5s ease forwards',
        'blink':       'blink 1s step-end infinite',
        'shimmer':     'shimmer 2s linear infinite',
        'glow':        'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:  { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        blink:   { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } },
        shimmer: { from: { backgroundPosition: '-200% center' }, to: { backgroundPosition: '200% center' } },
        glow:    { '0%,100%': { boxShadow: '0 0 12px rgba(139,92,246,0.4)' }, '50%': { boxShadow: '0 0 28px rgba(139,92,246,0.8)' } },
      },
    },
  },
  plugins: [],
}
