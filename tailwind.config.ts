import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#0f1115',
        card: '#171a21',
        accent: '#56d6ff'
      }
    }
  },
  plugins: []
};

export default config;
