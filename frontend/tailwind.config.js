/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        vestro: {
          page: '#020617',
          secondary: '#050816',
          card: '#07101F',
          elevated: '#0A1224',
          pink: '#EC168C',
          cyan: '#16BFFD',
          purple: '#7C3AED',
          text: '#F8FAFC',
          muted: '#94A3B8',
          border: 'rgba(148, 163, 184, 0.18)',
        },
      },
      boxShadow: {
        'vestro-sm': '0 10px 30px rgba(2, 6, 23, 0.35)',
        'vestro-cyan': '0 0 22px rgba(22, 191, 253, 0.22)',
        'vestro-pink': '0 0 22px rgba(236, 22, 140, 0.22)',
        'vestro-purple': '0 0 24px rgba(124, 58, 237, 0.22)',
      },
      ringColor: {
        vestro: '#16BFFD',
      },
      borderColor: {
        vestro: 'rgba(148, 163, 184, 0.18)',
      },
    },
  },
  plugins: [],
};
