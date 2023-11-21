/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{svelte,js,html}'],
  theme: {
    extend: {
      colors: {
        background: '#0f0f0f',
        text: '#f7f7f7',
        primary: '#999999',
        secondary: '#1f1f1f',
        accent: '#858585'
      },
      fontFamily: {
        mono: 'CourierPrime, courier'
      }
    }
  },
  plugins: []
};
