import type BlockState from "./BlockState";
import type { InBlockMutations } from "./BlockRenderer";

type RichTextKeybindHandler = {
  regex: RegExp,
  handler: (
    mutations: InBlockMutations,
    activeBlock: BlockState,
    searchResult: RegExpExecArray,
  ) => void
}

export default RichTextKeybindHandler;
