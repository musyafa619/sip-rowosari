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
          DEFAULT: '#059669',
          hover: '#047857',
          light: '#ecfdf5',
          50: '#f0fdf4',
        },
        accent: {
          DEFAULT: '#f59e0b',
          light: '#fffbeb',
        },
        surface: '#f8fafc',
        muted: '#64748b',
        status: {
          menunggu: '#f59e0b',
          diproses: '#3b82f6',
          selesai: '#10b981',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}
