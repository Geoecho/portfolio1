/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B6B',
        secondary: '#F5F5F5',
        dark: '#1A1A1A',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
      spacing: {
        'space-0': '0px',
        'space-1': '4px',
        'space-2': '8px',
        'space-3': '12px',
        'space-4': '16px',
        'space-5': '24px',
        'space-6': '32px',
        'space-7': '48px',
        'space-8': '64px',
        'space-9': '96px',
      },
      fontFamily: {
        heading: ['"Work Sans"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        space: ['"Space Grotesk"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
