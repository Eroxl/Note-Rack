// SOURCE: Tailwind Colours - https://tailwindcss.com/docs/customizing-colors

// ~ Colour lookup table for note rack page thumbnails
const Colours = [
  {
    category: 'Red',
    colours: [
      'FCA5A5',
      'F87171',
      'EF4444',
    ],
  },
  {
    category: 'Orange',
    colours: [
      'FDBA74',
      'FB923C',
      'F97316',
    ],
  },
  {
    category: 'Yellow',
    colours: [
      'FDE047',
      'FACC15',
      'EAB308',
    ],
  },
  {
    category: 'Lime',
    colours: [
      'BEF264',
      'A3E635',
      '84CC16',
    ],
  },
  {
    category: 'Green',
    colours: [
      '86EFAC',
      '4ADE80',
      '22C55E',
    ],
  },
  {
    category: 'Cyan',
    colours: [
      '67E8F9',
      '22D3EE',
      '06B6D4',
    ],
  },
  {
    category: 'Blue',
    colours: [
      '93C5FD',
      '60A5FA',
      '3B82F6',
    ],
  },
  {
    category: 'Purple',
    colours: [
      'D8B4FE',
      'C084FC',
      'A855F7',
    ],
  },
  {
    category: 'Pink',
    colours: [
      'F9A8D4',
      'F472B6',
      'EC4899',
    ],
  },
  {
    category: 'White',
    colours: [
      'F9FAFB',
      'D1D5DB',
      '71717A',
    ],
  },
];

// -=- Conversion -=-
// ~ Convert colours to a more useful format
const ConvertColours = () => (
  Colours.map((colourCategory) => ({
    category: colourCategory.category,
    colours: colourCategory.colours.map((colour) => {
      // -=- Conversion -=-
      // ~ Convert hex to rgb
      const [r, g, b] = [colour.substring(0, 2), colour.substring(2, 4), colour.substring(4)];
      
      // ~ Return converted colour's hex and rgb values
      return {
        hex: colour,
        colours: {
          r,
          g,
          b,
        },
      };
    }),
  }))
);

export default ConvertColours();
