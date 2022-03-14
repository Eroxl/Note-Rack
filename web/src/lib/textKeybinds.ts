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

export default textKeybinds;
