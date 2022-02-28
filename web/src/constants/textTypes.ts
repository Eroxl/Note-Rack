// -=- Styling lookup tabel for elements -=-
const stylingLookupTable: {[key: string]: string} = {
  h1: 'text-4xl font-bold',
  h2: 'text-3xl font-bold',
  h3: 'text-2xl font-bold',
  h4: 'text-xl font-bold',
  h5: 'text-lg font-bold',
  quote: 'border-l-4 pl-3 border-zinc-700 dark:border-amber-50',
  callout: 'p-3 bg-black/5 dark:bg-white/5',
};

// -=- Keybinds for non-inline elements -=-
const textKeybinds: {
  keybind: RegExp,
  plainTextKeybind: string,
  type: string,
  customFunc?: (
    properties: Record<string, unknown>,
    blockID: string,
    page: string
  ) => void
}[] = [
  {
    keybind: /^# /g,
    plainTextKeybind: '#',
    type: 'h1',
  },
  {
    keybind: /^## /g,
    plainTextKeybind: '##',
    type: 'h2',
  },
  {
    keybind: /^### /g,
    plainTextKeybind: '###',
    type: 'h3',
  },
  {
    keybind: /^#### /g,
    plainTextKeybind: '####',
    type: 'h4',
  },
  {
    keybind: /^##### /g,
    plainTextKeybind: '#####',
    type: 'h5',
  },
  {
    keybind: /^\* /g,
    plainTextKeybind: '*',
    type: 'u-list',
  },
  {
    keybind: /\d+\. /g,
    plainTextKeybind: '1.',
    type: 'o-list',
  },
  {
    keybind: /^\[ \]/g,
    plainTextKeybind: '[ ]',
    type: 'c-list',
  },
  {
    keybind: /^\| /g,
    plainTextKeybind: '|',
    type: 'quote',
  },
  {
    keybind: /^``` /g,
    plainTextKeybind: '```',
    type: 'callout',
  },
  {
    keybind: /^\[= \S+ =\]/gm,
    plainTextKeybind: '[= Page =]',
    type: 'page',
  },
];

export { stylingLookupTable, textKeybinds };
