import type BlockState from "./BlockState";
import type { InBlockMutations } from "./BlockRenderer";
import type SelectionState from "./SelectionState";

type RichTextKeybindHandler = {
  regex: RegExp,
  handler: (
    mutations: InBlockMutations,
    activeBlock: BlockState,
    searchResult: RegExpExecArray,
    selection?: SelectionState,
  ) => void
}

export default RichTextKeybindHandler;
