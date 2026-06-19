/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0E14',
        panel: '#11151D',
        panel2: '#161B25',
        line: '#232A38',
        signal: '#7FFFD4',
        signal2: '#5EEAD4',
        amber: '#F5A623',
        coral: '#FF6B6B',
        muted: '#7C8696',
        fog: '#C8D0DC',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        blink: {
          '0%, 49%': { opacity: 1 },
          '50%, 100%': { opacity: 0 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        pulse2: {
          '0%, 100%': { opacity: 0.5, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.06)' },
        },
      },
      animation: {
        shimmer: 'shimmer 4s linear infinite',
        blink: 'blink 1s step-end infinite',
        float: 'float 7s ease-in-out infinite',
        pulse2: 'pulse2 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
