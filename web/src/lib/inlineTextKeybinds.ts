import textKeybinds from './textKeybinds';

const inlineTextKeybinds: {
  keybind: RegExp,
  plainTextKeybind: string,
  type: string,
  customFunc?: (
    ...args: unknown[]
  ) => Promise<Record<string, unknown>>,
}[] = [
  {
    keybind: /(\*\*|__)(.*?)\1/g,
    plainTextKeybind: '**',
    type: 'bold',
  },
  {
    keybind: /(\*|_)(.*?)\1/g,
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
]

export default inlineTextKeybinds;