import type Keybind from "./Keybind";
import SelectionState from "./SelectionState";
import type { InBlockMutations } from "./BlockRenderer";
import BlockState from "./BlockState";

type KeybindHandler = {
  keybind: Keybind,
  handler: (
    mutations: InBlockMutations,
    state: BlockState[],
    selection: SelectionState | undefined,
    event: KeyboardEvent,
  ) => void,
}

export default KeybindHandler;
