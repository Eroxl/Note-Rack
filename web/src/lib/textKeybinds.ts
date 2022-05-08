import Router from 'next/router';

// -=- Keybinds for non-inline elements -=-
const textKeybinds: {
  keybind: RegExp,
  plainTextKeybind: string,
  type: string,
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
      Router.replace(`/note-rack/${blockID}/`);

      const addPageEvent = new CustomEvent('addPage', {
        detail: {
          newPageID: blockID,
          newPageStyle: {
            name: (element as HTMLSpanElement).innerText,
          },
        },
      });
      document.dispatchEvent(addPageEvent);

      return (properties);
    },
  },
];

export default textKeybinds;
