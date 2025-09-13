/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Linear Design System Colors
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#4ea7fc', // Linear Blue
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e'
        },
        background: {
          primary: 'var(--linear-bg-primary)',
          secondary: 'var(--linear-bg-secondary)',
          tertiary: 'var(--linear-bg-tertiary)',
          elevated: 'var(--linear-bg-elevated)'
        },
        text: {
          primary: 'var(--linear-text-primary)',
          secondary: 'var(--linear-text-secondary)',
          tertiary: 'var(--linear-text-tertiary)',
          muted: 'var(--linear-text-muted)',
          disabled: 'var(--linear-text-disabled)'
        },
        border: {
          primary: 'var(--linear-border-primary)',
          secondary: 'var(--linear-border-secondary)',
          focus: 'var(--linear-border-focus)'
        },
        accent: {
          blue: 'var(--linear-accent-blue)',
          red: 'var(--linear-accent-red)',
          green: 'var(--linear-accent-green)',
          orange: 'var(--linear-accent-orange)',
          yellow: 'var(--linear-accent-yellow)',
          indigo: 'var(--linear-accent-indigo)',
          plan: 'var(--linear-accent-plan)',
          build: 'var(--linear-accent-build)',
          security: 'var(--linear-accent-security)'
        }
      },
      fontFamily: {
        primary: 'var(--linear-font-primary)',
        serif: 'var(--linear-font-serif)',
        mono: 'var(--linear-font-mono)'
      },
      fontSize: {
        micro: '0.6875rem',
        tiny: '0.625rem',
        mini: '0.75rem',
        small: '0.8125rem',
        regular: '0.9375rem',
        large: '1.125rem',
        'title-1': '1.0625rem',
        'title-2': '1.3125rem',
        'title-3': '1.5rem',
        'title-4': '2rem',
        'title-5': '2.5rem',
        'title-6': '3rem',
        'title-7': '3.5rem',
        'title-8': '4rem',
        'title-9': '4.5rem'
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '510',
        semibold: '590',
        bold: '680'
      },
      borderRadius: {
        'linear-sm': 'var(--linear-radius-sm)',
        'linear-md': 'var(--linear-radius-md)',
        'linear-lg': 'var(--linear-radius-lg)',
        'linear-xl': 'var(--linear-radius-xl)'
      },
      spacing: {
        'linear-xs': 'var(--linear-spacing-xs)',
        'linear-sm': 'var(--linear-spacing-sm)',
        'linear-md': 'var(--linear-spacing-md)',
        'linear-lg': 'var(--linear-spacing-lg)',
        'linear-xl': 'var(--linear-spacing-xl)'
      },
      height: {
        'header': 'var(--linear-header-height)'
      },
      maxWidth: {
        'container': 'var(--linear-container-max-width)'
      },
      backdropBlur: {
        'linear': '20px'
      },
      transitionDuration: {
        'linear-fast': 'var(--linear-animation-fast)',
        'linear-normal': 'var(--linear-animation-normal)',
        'linear-slow': 'var(--linear-animation-slow)'
      },
      transitionTimingFunction: {
        'linear-ease-out': 'var(--linear-ease-out)'
      },
      boxShadow: {
        'linear-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'linear-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'linear-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'linear-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }
    },
  },
  plugins: [],
}