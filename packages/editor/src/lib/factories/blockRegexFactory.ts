import type RichTextKeybindHandler from "../../types/RichTextKeybindHandler";
import getBlockById from "../helpers/getBlockByID";
import focusElement from "../helpers/focusElement";

const blockRegexFactory = (type: string) => (
  ((mutations, block, searchResult) => {
    mutations.editBlock(
      block.id,
      {
        text: searchResult[1],
      },
      type
    );


    setTimeout(() => {
      const blockElement = getBlockById(block.id);

      if (!blockElement) return;

      focusElement(blockElement, 0);
    })
  }) as RichTextKeybindHandler['handler']
)

export default blockRegexFactory;
