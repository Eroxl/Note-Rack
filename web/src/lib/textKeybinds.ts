import type BlockTypes from './constants/BlockTypes';

// -=- Keybinds -=-
// ~ Keybinds for block elements
const textKeybinds: {
  keybind: RegExp,
  plainTextKeybind: string,
  type: keyof typeof BlockTypes,
  customFunc?: (
    properties: Record<string, unknown>, blockID: string,
    page: string, element: unknown,
  ) => Promise<Record<string, unknown>>,
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
    keybind: /^\[\[ (.+) \]\]/gm,
    plainTextKeybind: '[[ Page ]]',
    type: 'page',
    customFunc: async (properties, blockID, page, element) => {
      // ~ Send a POST request to the API to create a new page
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/modify-page/${page}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'new-page-id': blockID,
          'new-page-name': (element as HTMLSpanElement).innerText,
        }),
        credentials: 'include',
      });

      // ~ Dispatch an event to add the new page to the sidebar
      const addPageEvent = new CustomEvent('addPage', {
        detail: {
          newPageID: blockID,
          newPageStyle: {
            name: (element as HTMLSpanElement).innerText,
          },
        },
      });
      document.dispatchEvent(addPageEvent);

      // ~ Return the new block properties
      return (properties);
    },
  },
  {
    keybind: /^\$\$ (.*)/g,
    plainTextKeybind: '$$',
    type: 'math',
  },
];

export default textKeybinds;
