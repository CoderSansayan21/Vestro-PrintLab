/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        vestro: {
          page: '#03070B',
          secondary: '#071018',
          card: '#0B141D',
          elevated: '#101A24',
          gold: '#D6A737',
          'gold-light': '#F2CE72',
          'gold-dark': '#8A641D',
          text: '#F8FAFC',
          muted: '#9CA3AF',
          border: 'rgba(214, 167, 55, 0.20)',
          pink: '#D6A737',
          cyan: '#F2CE72',
          purple: '#8A641D',
        },
      },
      boxShadow: {
        'vestro-sm': '0 12px 32px rgba(0, 0, 0, 0.35)',
        'vestro-md': '0 18px 48px rgba(0, 0, 0, 0.42)',
        'vestro-gold': '0 0 26px rgba(214, 167, 55, 0.22)',
        'vestro-cyan': '0 0 22px rgba(214, 167, 55, 0.16)',
        'vestro-pink': '0 0 22px rgba(214, 167, 55, 0.18)',
        'vestro-purple': '0 0 24px rgba(138, 100, 29, 0.18)',
      },
      ringColor: {
        vestro: '#D6A737',
      },
      borderColor: {
        vestro: 'rgba(214, 167, 55, 0.20)',
      },
    },
  },
  plugins: [],
};
