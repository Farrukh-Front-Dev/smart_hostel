/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0f0f0f',
        'dark-surface': '#1a1a1a',
        'primary-cyan': '#38C9E6',
        'primary-green': '#43E8A0',
        'accent-pink': '#FF9B9B',
        'accent-pink-hover': '#FF8888',
        'light-bg': '#ffffff',
        'light-surface': '#f5f5f5',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to bottom right, #38C9E6, #43E8A0)',
        'gradient-pink': 'linear-gradient(to bottom right, #FF9B9B, #FF8888)',
      },
      boxShadow: {
        '3d-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
        '3d': '3px 3px 0px 0px rgba(0,0,0,1)',
        '3d-md': '4px 4px 0px 0px rgba(0,0,0,1)',
        '3d-lg': '5px 5px 0px 0px rgba(0,0,0,1)',
        '3d-xl': '8px 8px 0px 0px rgba(0,0,0,1)',
      },
    },
  },
  plugins: [],
};
