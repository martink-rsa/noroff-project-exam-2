/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Soft Sage Green as Primary
        primary: {
          50: '#f8faf8',
          100: '#e8f5e8',
          200: '#d1ead1',
          300: '#a7d4a7',
          400: '#7bb87b',
          500: '#5a9d5a',
          600: '#478147',
          700: '#3a683a',
          800: '#315631',
          900: '#2a472a',
        },
        // Warm Peach as Secondary
        secondary: {
          50: '#fef9f7',
          100: '#fef1ed',
          200: '#fde0d6',
          300: '#fbc7b1',
          400: '#f7a584',
          500: '#f28a5f',
          600: '#e06d3f',
          700: '#c4552d',
          800: '#a3452a',
          900: '#863c28',
        },
        // Soft Lavender as Accent
        accent: {
          50: '#faf9ff',
          100: '#f3f1ff',
          200: '#e9e5ff',
          300: '#d7cfff',
          400: '#bfadff',
          500: '#a487ff',
          600: '#8b5fff',
          700: '#7640f7',
          800: '#6332e3',
          900: '#522abd',
        },
        // Neutral grays with warm undertones
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e8e8e8',
          300: '#d1d1d1',
          400: '#b0b0b0',
          500: '#8f8f8f',
          600: '#6e6e6e',
          700: '#525252',
          800: '#3a3a3a',
          900: '#262626',
        },
        // Success, warning, and error in pastel tones
        success: {
          50: '#f0f9f0',
          100: '#dcf2dc',
          200: '#bce5bc',
          300: '#8fd18f',
          400: '#5db55d',
          500: '#3a9b3a',
          600: '#2d7d2d',
          700: '#256325',
          800: '#215021',
          900: '#1d421d',
        },
        warning: {
          50: '#fffbf0',
          100: '#fff5d6',
          200: '#ffe9ac',
          300: '#ffd777',
          400: '#ffbd3a',
          500: '#ffa00f',
          600: '#f08500',
          700: '#c66400',
          800: '#9d4e00',
          900: '#7e4100',
        },
        error: {
          50: '#fef7f7',
          100: '#fdeaea',
          200: '#f9d5d5',
          300: '#f3b3b3',
          400: '#ea8a8a',
          500: '#de6464',
          600: '#cb4747',
          700: '#aa3535',
          800: '#8c2e2e',
          900: '#752a2a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 4px 20px 0 rgba(0, 0, 0, 0.08)',
        'soft-xl': '0 8px 30px 0 rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1.125rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}