/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{svelte,ts,html}'],
  theme: {
    extend: {
      colors: {
        background: '#0f0f0f',
        text: '#f7f7f7',
        primary: '#999999',
        secondary: '#1f1f1f',
        'secondary-hover': '#2f2f2f',
        accent: '#858585',
        error: '#9e3641',
        info: '#999999',
        success: '#2b6963'
      },
      brightness: {
        25: '.25'
      },
      fontFamily: {
        mono: 'CourierPrime, courier'
      }
    }
  },
  plugins: []
};
