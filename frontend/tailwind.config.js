/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#10192E',
          light: '#1C2841',
        },
        canvas: '#FAF9F5',
        amber: {
          DEFAULT: '#F0A500',
          soft: '#FFF3D6',
        },
        slate: {
          750: '#2B354B',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        hex: '0.65rem',
      },
    },
  },
  plugins: [],
}
