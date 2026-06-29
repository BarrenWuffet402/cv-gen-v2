/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: { DEFAULT: '#C4956A', light: '#EDE5DA', lighter: '#F0EAE2', dark: '#7A5C44' },
        warm: { bg: '#FAFAF8', text: '#2C2C2C', muted: '#6B6B6B', border: '#E8E0D8' },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
