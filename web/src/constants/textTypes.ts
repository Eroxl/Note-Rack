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
  type: string,
  customFunc?: (
    properties: Record<string, unknown>,
    blockID: string,
    page: string
  ) => void
}[] = [
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
    keybind: /^``` /g,
    type: 'callout',
  },
  {
    keybind: /^\[= \S+ =\]/gm,
    type: 'page',
  },
];

export { stylingLookupTable, textKeybinds };
