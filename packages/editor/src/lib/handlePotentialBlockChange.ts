import mutations from "../mutations";
import type { InBlockMutations } from "../types/BlockRenderer";
import type BlockState from "../types/BlockState";
import type RichTextKeybindHandler from "../types/RichTextKeybindHandler";
import type RemoveFirstFromTuple from "../types/helpers/RemoveFirstFromTuple";
import focusElement from "./helpers/focusElement";
import getBlockById from "./helpers/getBlockByID";

const handlePotentialBlockChange = (
  args: any[],
  state: BlockState[],
  editorMutations: InBlockMutations,
  richTextKeybinds: RichTextKeybindHandler[]
) => {
  const [
    blockId,
    updatedProperties,
  ] = args as RemoveFirstFromTuple<Parameters<typeof mutations.editBlock>>;

  if(!updatedProperties || typeof updatedProperties.text !== 'string') return false;

  const block = state.find((block) => block.id === blockId);

  let found = false;

  richTextKeybinds.forEach((keybind) => {
    const {
      regex,
      handler
    } = keybind;

    const {
      text
    } = updatedProperties as { text: string };

    const regexSearch = regex.exec(text);

    if (!regexSearch || !block) return;

    found = true;

    handler(editorMutations, block, regexSearch);

    setTimeout(() => {
      const blockElement = getBlockById(blockId);

      if (!blockElement) return;

      focusElement(blockElement, 0);
    })
  });
};

export default handlePotentialBlockChange;
