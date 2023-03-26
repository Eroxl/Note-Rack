module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        print: {
          raw: 'print',
        },
      },
      boxShadow: {
        'under': '0.15rem 0.15rem 0px',
      },
    },
  },
  variants: {
  },
  plugins: [],
  important: true,
  darkMode: 'class',
};
