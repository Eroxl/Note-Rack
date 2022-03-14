// -=- Styling lookup tabel for elements -=-
const stylingLookupTable: {[key: string]: string} = {
  text: '',
  h1: 'text-4xl font-bold',
  h2: 'text-3xl font-bold',
  h3: 'text-2xl font-bold',
  h4: 'text-xl font-bold',
  h5: 'text-lg font-bold',
  quote: 'border-l-4 pl-3 border-zinc-700 dark:border-amber-50 print:dark:border-zinc-700',
  callout: `
    p-3
    bg-black/5 dark:bg-white/5
    print:bg-transparent print:dark:bg-transparent
    print:before:h-full print:before:w-full
    print:before:border-[999px] print:before:-m-3 print:before:border-black/5
    relative print:overflow-hidden print:before:absolute
  `,
};

// -=- Keybinds for non-inline elements -=-
const textKeybinds: {
  keybind: RegExp,
  plainTextKeybind: string,
  type: string,
  customFunc?: (
    properties: Record<string, unknown>, blockID: string,
    page: string, element: Element,
  ) => Record<string, unknown>,
}[] = [
  {
    keybind: /^# (.*)/g,
    plainTextKeybind: '#',
    type: 'h1',
  },
  {
    keybind: /^## (.*)/g,
    plainTextKeybind: '##',
    type: 'h2',
  },
  {
    keybind: /^### (.*)/g,
    plainTextKeybind: '###',
    type: 'h3',
  },
  {
    keybind: /^#### (.*)/g,
    plainTextKeybind: '####',
    type: 'h4',
  },
  {
    keybind: /^##### (.*)/g,
    plainTextKeybind: '#####',
    type: 'h5',
  },
  {
    keybind: /^\* (.*)/g,
    plainTextKeybind: '*',
    type: 'u-list',
    customFunc: (properties) => ({ relationship: 'sibling', ...properties }),
  },
  {
    keybind: /\d+\. (.*)/g,
    plainTextKeybind: '1.',
    type: 'o-list',
  },
  {
    keybind: /^\[\s?\] (.*)/g,
    plainTextKeybind: '[ ]',
    type: 'c-list',
  },
  {
    keybind: /^> (.*)/g,
    plainTextKeybind: '>',
    type: 'quote',
  },
  {
    keybind: /^\| (.*)/g,
    plainTextKeybind: '|',
    type: 'callout',
  },
  {
    keybind: /^\[\[ (\S+) \]\]/gm,
    plainTextKeybind: '[[ Page ]]',
    type: 'page',
  },
];

export { stylingLookupTable, textKeybinds };
