/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: '#181A1F',
        surface: '#20232A',
        neon: '#00FF66',
        cyan: '#00D0FF',
        amber: '#FF9800',
        pink: '#FF6B9D',
        muted: '#9599A1',
        dark: '#111317',
      },
    },
  },
  plugins: [],
};
