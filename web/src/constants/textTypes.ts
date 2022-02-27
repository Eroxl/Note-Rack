// -=- Styling lookup tabel for elements -=-
const stylingLookupTable: {[key: string]: string} = {
  h1: 'text-4xl font-bold',
  h2: 'text-3xl font-bold',
  h3: 'text-2xl font-bold',
  h4: 'text-xl font-bold',
  h5: 'text-lg font-bold',
  quote: 'border-l-4 pl-3 border-zinc-700',
  callout: 'p-3 bg-black/5',
};

// -=- Keybinds for non-inline elements -=-
const textKeybinds: {keybind: RegExp, type: string}[] = [
  {
    keybind: /^# /g,
    type: 'h1',
  },
  {
    keybind: /^## /g,
    type: 'h2',
  },
  {
    keybind: /^### /g,
    type: 'h3',
  },
  {
    keybind: /^#### /g,
    type: 'h4',
  },
  {
    keybind: /^##### /g,
    type: 'h5',
  },
  {
    keybind: /^\* /g,
    type: 'u-list',
  },
  {
    keybind: /\d+\. /g,
    type: 'o-list',
  },
  {
    keybind: /^\[ \]/g,
    type: 'c-list',
  },
  {
    keybind: /^\| /g,
    type: 'quote',
  },
  {
    keybind: /^= /g,
    type: 'callout',
  },
];

export { stylingLookupTable, textKeybinds };
