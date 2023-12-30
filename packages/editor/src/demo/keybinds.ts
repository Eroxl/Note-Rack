import type KeybindHandler from "src/types/KeybindHandler";
import inlineBlockKeybindFactory from "src/lib/factories/inlineBlockKeybindFactory";

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
