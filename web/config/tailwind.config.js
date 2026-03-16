/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00bfff',
          dark: '#0099cc',
        },
        secondary: '#FFD43B',
        background: {
          DEFAULT: '#222e3c',
          light: '#232f3e',
          dark: '#181f2a',
        },
      },
    },
  },
  plugins: [],
}
