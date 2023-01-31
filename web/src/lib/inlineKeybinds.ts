// -=- Keybinds -=-
// ~ Keybinds for inline elements
const inlineKeybinds: {
  keybind: RegExp,
  plainTextKeybind: string,
  type: string,
  canBeNested: boolean,
}[] = [
  {
    keybind: /\*\*([^*]+)\*\*/g,
    plainTextKeybind: '**',
    type: 'bold',
    canBeNested: true,
  },
  {
    keybind: /\*(.+)\*/g,
    plainTextKeybind: '*',
    type: 'italic',
    canBeNested: true,
  },
  {
    keybind: /--(.+)--/g,
    plainTextKeybind: '--',
    type: 'strikethrough',
    canBeNested: true,
  },
  {
    keybind: /__(.+)__/g,
    plainTextKeybind: '__',
    type: 'underline',
    canBeNested: true,
  },
  {
    keybind: /\$(.+)\$/g,
    plainTextKeybind: '$',
    type: 'math',
    canBeNested: false,
  },
  {
    keybind: /`(.+)`/g,
    plainTextKeybind: '`',
    type: 'code',
    canBeNested: false,
  },
];

export default inlineKeybinds;
