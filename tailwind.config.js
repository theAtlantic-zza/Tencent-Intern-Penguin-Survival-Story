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
      },
      animation: {
        'float-in': 'floatIn 0.35s ease-out both',
        pop: 'pop 0.25s ease-out both',
      },
    },
  },
  plugins: [],
};
