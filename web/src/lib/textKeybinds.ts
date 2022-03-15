import Router from 'next/router';

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
    customFunc: (properties, blockID) => {
      const { value } = properties;

      // TODO: Create a new page based on this blocks props
      Router.replace(`/note-rack/${blockID}/`);

      return (properties);
    },
  },
];

export default textKeybinds;
