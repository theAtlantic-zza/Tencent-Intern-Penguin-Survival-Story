/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        tx: {
          blue: '#0052D9',
          deep: '#003A99',
          ice: '#E8F1FF',
        },
      },
      fontFamily: {
        sans: [
          '"PingFang SC"',
          '"Microsoft YaHei"',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
      },
      boxShadow: {
        soft: '0 8px 30px rgba(0, 82, 217, 0.12)',
      },
      keyframes: {
        floatIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pop: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        deltaPop: {
          '0%': { opacity: '0', transform: 'translateY(4px) scale(0.7)' },
          '15%': { opacity: '1', transform: 'translateY(-4px) scale(1.15)' },
          '70%': { opacity: '1', transform: 'translateY(-6px) scale(1.05)' },
          '100%': { opacity: '0', transform: 'translateY(-12px) scale(0.95)' },
        },
        chipPop: {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.85)' },
          '50%': { opacity: '1', transform: 'translateY(-2px) scale(1.06)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'float-in': 'floatIn 0.35s ease-out both',
        pop: 'pop 0.25s ease-out both',
        'delta-pop': 'deltaPop 1.3s ease-out both',
        'chip-pop': 'chipPop 0.45s cubic-bezier(0.34,1.56,0.64,1) both',
      },
    },
  },
  plugins: [],
};
