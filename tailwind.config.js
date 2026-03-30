/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Bebas Neue"', 'cursive'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        bg: '#0a0a0a',
        surface: '#111111',
        surface2: '#161616',
        border: '#1e1e1e',
        accent: '#00ff87',
        'accent-dim': '#00cc6a',
        muted: '#3a3a3a',
        text: '#e8e8e8',
        'text-dim': '#666666',
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        blink: { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0 } },
        slideUp: { '0%': { transform: 'translateY(16px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        glow: { '0%': { textShadow: '0 0 10px #00ff87' }, '100%': { textShadow: '0 0 30px #00ff87, 0 0 60px #00ff8740' } },
      }
    },
  },
  plugins: [],
}


