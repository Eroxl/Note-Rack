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
    },
  },
  variants: {
  },
  plugins: [],
  important: true,
  darkMode: 'class',
};
