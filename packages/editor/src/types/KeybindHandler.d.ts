import type Keybind from "./Keybind";

type KeybindHandler = {
  keybind: Keybind,
  handler: (
    mutations: InBlockMutations,
    activeBlock: BlockState,
  ) => void,
}

export default KeybindHandler;
