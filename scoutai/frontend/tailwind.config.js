/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060d1f',
          900: '#0a1628',
          800: '#0f1f3d',
          700: '#162447',
          600: '#1d3461',
        },
        teal: {
          400: '#2dd4bf',
          500: '#00d4aa',
          600: '#00b894',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
