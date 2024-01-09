import type KeybindHandler from "../types/KeybindHandler";
import inlineBlockKeybindFactory from "../lib/factories/inlineBlockKeybindFactory";
import blockKeybindFactory from '../lib/factories/blockKeybindFactory';

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
  {
    handler: blockKeybindFactory('text'),
    keybind: 'Meta+Shift+0',
  },
  {
    handler: blockKeybindFactory('h1'),
    keybind: 'Meta+Shift+1',
  },
  {
    handler: blockKeybindFactory('h2'),
    keybind: 'Meta+Shift+2',
  },
  {
    handler: blockKeybindFactory('h3'),
    keybind: 'Meta+Shift+3',
  }
];

export default keybinds;
