import type Keybind from "./Keybind";
import SelectionState from "./SelectionState";
import type { InBlockMutations } from "./BlockRenderer";
import EditorState from "./EditorState";

type KeybindHandler = {
  keybind: Keybind,
  handler: (
    mutations: InBlockMutations,
    state: EditorState,
    selection: SelectionState | undefined,
    event: KeyboardEvent,
  ) => void,
}

export default KeybindHandler;
