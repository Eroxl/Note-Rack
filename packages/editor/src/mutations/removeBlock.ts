import type BlockState from "../types/BlockState";
import EditorState from "../types/EditorState";

/**
 * Remove a block from the editor state.
 * @param state The editor state to modify.
 * @param blockId The ID of the block to remove.
 * 
 * @returns The modified editor state.
 */
const removeBlock = (
  state: EditorState,
  blockId: string,
): EditorState => {
  const newState = {
    ...state,
    blocks: [...state.blocks],
  };

  const blockIndex = newState.blocks.findIndex((b) => b.id === blockId);

  if (blockIndex === -1) {
    throw new Error(`Attempted to remove non-existent block with ID "${blockId}".`);
  }

  newState.blocks.splice(blockIndex, 1);

  return newState;
};

export default removeBlock;
