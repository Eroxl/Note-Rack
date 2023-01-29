// -=- Keybinds -=-
// ~ Keybinds for inline elements
const inlineKeybinds: {
  keybind: RegExp,
  plainTextKeybind: string,
  type: string,
  canBeNested: boolean,
}[] = [
  {
    keybind: /\*\*(.*)\*\*/g,
    plainTextKeybind: '**{{$1}}**',
    type: 'bold',
    canBeNested: true,
  },
  {
    keybind: /\*(.*)\*/g,
    plainTextKeybind: '*{{$1}}*',
    type: 'italic',
    canBeNested: true,
  },
  {
    keybind: /~~(.*)~~/g,
    plainTextKeybind: '--{{$1}}--',
    type: 'strikethrough',
    canBeNested: true,
  },
  {
    keybind: /__(.*)__/g,
    plainTextKeybind: '__{{$1}}__',
    type: 'underline',
    canBeNested: true,
  },
  {
    keybind: /\$(.*)\$/g,
    plainTextKeybind: '${{$1}}$',
    type: 'math',
    canBeNested: false,
  },
  {
    keybind: /`(.*)`/g,
    plainTextKeybind: '`{{$1}}`',
    type: 'code',
    canBeNested: false,
  },
];

export default inlineKeybinds;
