import mutations from "../mutations";
import type { InBlockMutations } from "../types/BlockRenderer";
import type BlockState from "../types/BlockState";
import type RichTextKeybindHandler from "../types/RichTextKeybindHandler";
import type RemoveFirstFromTuple from "../types/helpers/RemoveFirstFromTuple";
import getEditorSelection from "./getEditorSelection";

const handlePotentialBlockChange = (
  args: any[],
  state: BlockState[],
  editorMutations: InBlockMutations,
  richTextKeybinds: RichTextKeybindHandler[],
  editorElement: HTMLElement,
) => {
  const [
    blockId,
    updatedProperties,
  ] = args as RemoveFirstFromTuple<Parameters<typeof mutations.editBlock>>;

  const block = state.find((block) => block.id === blockId);

  if (!block) return;

  let newText: string | undefined;

  if (typeof updatedProperties === 'function') {
    newText = updatedProperties(block?.properties).text as string | undefined;
  } else if (updatedProperties) {
    newText = updatedProperties.text as string | undefined;
  }

  if (!newText) return false;

  let found = false;

  richTextKeybinds.forEach((keybind) => {
    const {
      regex,
      handler
    } = keybind;

    const regexSearch = regex.exec(newText!);

    if (!regexSearch) return;

    found = true;

    const selection = getEditorSelection(editorElement)

    handler(editorMutations, block, regexSearch, selection);
  });

  return found;
};

export default handlePotentialBlockChange;
