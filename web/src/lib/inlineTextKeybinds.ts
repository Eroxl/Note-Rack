const inlineTextKeybinds = [
  {
    keybind: /(\*\*)(.*?)\1/,
    plainTextKeybind: '**',
    type: 'bold',
  },
  {
    keybind: /(\*)(.*?)\1/,
    plainTextKeybind: '*',
    type: 'italic',
  },
  {
    keybind: /(--)(.*?)\1/,
    plainTextKeybind: '--',
    type: 'strikethrough',
  },
  {
    keybind: /(__)(.*?)\1/,
    plainTextKeybind: '__',
    type: 'underline',
  },
] as const;

export default inlineTextKeybinds;