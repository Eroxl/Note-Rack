const inlineTextKeybinds = [
  {
    keybind: /(\*\*)(.*?)\1/g,
    plainTextKeybind: '**',
    type: 'bold',
  },
  {
    keybind: /(?<!\*)(\*)(?!\*)(.*?)\1/g,
    plainTextKeybind: '*',
    type: 'italic',
  },
  {
    keybind: /(--)(.*?)\1/g,
    plainTextKeybind: '--',
    type: 'strikethrough',
  },
  {
    keybind: /(__)(.*?)\1/g,
    plainTextKeybind: '__',
    type: 'underline',
  },
] as const;

export default inlineTextKeybinds;
