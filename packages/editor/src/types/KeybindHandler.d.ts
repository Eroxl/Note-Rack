import type Keybind from "./Keybind";
import SelectionState from "./SelectionState";

type KeybindHandler = {
  keybind: Keybind,
  handler: (
    mutations: InBlockMutations,
    activeBlock: BlockState,
    selection: SelectionState,
  ) => void,
}

export default KeybindHandler;
