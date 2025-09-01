/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff8f5',
          100: '#ffe9df',
          200: '#ffd1b8',
          300: '#ffb388',
          400: '#ff9158',
          500: '#ff6f2b',
          600: '#e25719',
          700: '#bb4515',
          800: '#943513',
          900: '#7a2c11'
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.08)'
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' }
        }
      },
      animation: {
        marquee: 'marquee 20s linear infinite'
      },
      extend: {
        animation: {
          'paused': 'none'
        }
      }
    }
  },
  plugins: []
}
