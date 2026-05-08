/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg:      '#070D18',
          surface: '#0C1929',
          card:    '#0F2035',
          border:  '#1A3050',
          red:     '#FF1744',
          neon:    '#00E5A0',
          gold:    '#FFB800',
          blue:    '#3B9EFF',
          text:    '#E6F4F0',
          dim:     '#3D7070',
        },
        shelter: {
          building:  '#3B9EFF',
          municipal: '#00E5A0',
          safe_room: '#FF9F1C',
        },
      },
      fontFamily: {
        sans: ['Rubik', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      boxShadow: {
        'neon':    '0 0 0 1px rgba(0,229,160,0.25), 0 0 24px rgba(0,229,160,0.15)',
        'neon-lg': '0 0 0 1px rgba(0,229,160,0.35), 0 0 40px rgba(0,229,160,0.25)',
        'red':     '0 0 0 1px rgba(255,23,68,0.35),  0 0 32px rgba(255,23,68,0.25)',
        'red-lg':  '0 0 0 4px rgba(255,23,68,0.2),   0 8px 40px rgba(255,23,68,0.35)',
      },
    },
  },
  plugins: [],
}
