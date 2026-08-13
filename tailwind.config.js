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
          DEFAULT: '#16A34A',
          hover: '#15803D',
          light: '#DCFCE7',
        },
        secondary: {
          DEFAULT: '#0EA5E9',
          light: '#E0F2FE',
        },
        surface: '#F8FAFC',
        'bg-alt': '#F0FDF4',
        status: {
          menunggu: '#F59E0B',
          diproses: '#3B82F6',
          selesai: '#10B981',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
