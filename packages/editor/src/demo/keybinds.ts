import type KeybindHandler from "../types/KeybindHandler";
import inlineBlockKeybindFactory from "../lib/factories/inlineBlockKeybindFactory";

const keybinds: KeybindHandler[] = [
  {
    handler: inlineBlockKeybindFactory('bold'),
    keybind: 'Meta+b',
  },
  {
    handler: inlineBlockKeybindFactory('italic'),
    keybind: 'Meta+i',
  },
  {
    handler: inlineBlockKeybindFactory('underline'),
    keybind: 'Meta+u',
  },
];

export default keybinds;
