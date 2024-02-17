import type BlockState from "./BlockState";
import type SelectionState from "./SelectionState";

type EditorState = {
  blocks: BlockState[];
  selection?: SelectionState;
};

export default EditorState;
