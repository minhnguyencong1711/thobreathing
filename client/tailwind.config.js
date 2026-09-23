/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E63375', // Vibrant Pink: Logos, titles, key accents
          hover: '#cf2565',
          light: '#fcebf1',
        },
        secondary: {
          DEFAULT: '#2172D7', // Bright Royal Blue: Solid panel, secondary text, line art
          hover: '#1b5eb3',
          light: '#e9f1fb',
        },
        'page-bg': '#F4F5F7', // Off-White: Brochure page background
        'body-text': '#2C3B4E', // Dark Slate: Body text
        'soft-pink': '#E89FB2', // Dusty Pink: Subtle accents, borders, soft highlights
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        'soft': '0 10px 30px rgba(44, 59, 78, 0.08)',
        'soft-lg': '0 20px 50px rgba(44, 59, 78, 0.14)',
        'primary-glow': '0 10px 30px rgba(230, 51, 117, 0.35)',
      },
      animation: {
        'breathe': 'breathePulse 6s ease-in-out infinite',
        'orb-slow': 'orbFloat 16s ease-in-out infinite alternate',
      },
      keyframes: {
        breathePulse: {
          '0%, 100%': { transform: 'scale(0.88)', opacity: '0.85' },
          '50%': { transform: 'scale(1.08)', opacity: '1' },
        },
        orbFloat: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(40px, 50px) scale(1.12)' },
          '100%': { transform: 'translate(-30px, 30px) scale(0.95)' },
        },
      },
    },
  },
  plugins: [],
}
