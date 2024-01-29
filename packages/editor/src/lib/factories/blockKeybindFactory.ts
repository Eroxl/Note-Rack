import type KeybindHandler from "../../types/KeybindHandler";
import restoreSelection from "../../lib/helpers/restoreSelection";

const blockKeybindFactory = (type: string) => {
  const handler: KeybindHandler['handler'] = (mutations, _, selection, event) => {
    const currentBlockID = selection?.blockId;

    if (!currentBlockID) return;

    event.preventDefault();
    event.stopPropagation();

    mutations.editBlock(
      currentBlockID,
      undefined,
      type,
    );

    setTimeout(() => {
      restoreSelection(selection);
    });
  }

  return handler;
}

export default blockKeybindFactory;
