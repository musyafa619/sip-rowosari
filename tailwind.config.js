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
          DEFAULT: '#1a7f37',
          hover: '#15612a',
          light: '#eef6f0',
        },
        secondary: {
          DEFAULT: '#4a5568',
          light: '#edf0f4',
        },
        surface: '#f7f8fa',
        'bg-alt': '#f0f2f5',
        status: {
          menunggu: '#d97706',
          diproses: '#2563eb',
          selesai: '#059669',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
