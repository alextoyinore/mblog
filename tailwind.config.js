/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/**/*.html",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // NYT-like fonts
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        sans: ['Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        // Custom colors matching NYT style
        'nyt-black': '#121212',
        'nyt-gray': {
          100: '#f7f7f7',
          200: '#e2e2e2',
          300: '#cccccc',
          400: '#999999',
          500: '#666666',
          600: '#444444',
          700: '#333333',
          800: '#222222',
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      fontSize: {
        'xxs': '0.625rem',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      boxShadow: {
        'nav': '0 2px 4px rgba(0,0,0,0.02)',
        'nav-dark': '0 2px 4px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),  // Optional: for better typography
    require('@tailwindcss/forms'),      // Optional: for better form styling
  ],
  variants: {
    extend: {
      display: ['dark'],
      backgroundColor: ['dark', 'dark:hover'],
      textColor: ['dark', 'dark:hover'],
      borderColor: ['dark'],
      opacity: ['dark'],
    },
  },
} 
