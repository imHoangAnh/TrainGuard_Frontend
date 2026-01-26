/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rail: {
          dark: '#0a0a0f',
          darker: '#050507',
          panel: '#12121a',
          border: '#2a2a35',
          primary: '#00f0ff',
          secondary: '#7000ff',
          success: '#00ff9d',
          warning: '#ffb86c',
          critical: '#ff003c',
          text: '#e0e0e0',
          muted: '#858595'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Orbitron', 'monospace'], // For numbers/IDs
      },
      boxShadow: {
        'glow-primary': '0 0 10px rgba(0, 240, 255, 0.5)',
        'glow-critical': '0 0 15px rgba(255, 0, 60, 0.6)',
        'glow-warning': '0 0 10px rgba(255, 184, 108, 0.5)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
