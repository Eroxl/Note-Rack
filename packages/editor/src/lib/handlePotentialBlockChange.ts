import mutations from "../mutations";
import type { InBlockMutations } from "../types/BlockRenderer";
import EditorState from "../types/EditorState";
import type RichTextKeybindHandler from "../types/RichTextKeybindHandler";
import type RemoveFirstFromTuple from "../types/helpers/RemoveFirstFromTuple";
import getEditorSelection from "./getEditorSelection";

const handlePotentialBlockChange = (
  args: any[],
  state: EditorState,
  editorMutations: InBlockMutations,
  richTextKeybinds: RichTextKeybindHandler[],
  editorElement: HTMLElement,
) => {
  const [
    blockId,
    updatedProperties,
  ] = args as RemoveFirstFromTuple<Parameters<typeof mutations.editBlock>>;

  if(!updatedProperties || typeof updatedProperties.text !== 'string') return false;

  const block = state.blocks.find((block) => block.id === blockId);

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

    const selection = getEditorSelection(editorElement)

    handler(editorMutations, block, regexSearch, selection);
  });

  return found;
};

export default handlePotentialBlockChange;
