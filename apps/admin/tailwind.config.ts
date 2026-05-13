import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#181A1F',
        surface: '#20232A',
        neon: '#00FF66',
        cyan: '#00D0FF',
        amber: '#FF9800',
        muted: '#9599A1',
        dark: '#111317',
      },
    },
  },
  plugins: [],
};
export default config;
