import type KeybindHandler from "src/types/KeybindHandler";

const keybinds: KeybindHandler[] = [
  {
    handler: () => {
      console.log('Keybind 1 pressed!');
    },
    keybind: 'Control+0',
  }
];

export default keybinds;
