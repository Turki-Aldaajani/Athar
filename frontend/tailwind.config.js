/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        heritage: {
          beige:     '#f5e6ca',
          'beige-dark': '#e8d5b0',
          cream:     '#fdf8f0',
          brown:     '#2C1810',
          'brown-md':'#5C4033',
          gold:      '#C5A028',
          'gold-lt': '#f0d97a',
          green:     '#1B5E20',
          'green-md':'#2E7D32',
          'green-lt':'#E8F5E9',
        },
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
