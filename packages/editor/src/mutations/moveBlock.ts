import type BlockState from "../types/BlockState";
import addBlock from "./addBlock";
import removeBlock from "./removeBlock";

/**
 * Move a block to a new position in the editor state.
 * @param state The editor state to modify.
 * @param blockId The ID of the block to move.
 * @param afterId The ID of the block to move the block after (if not provided, the block will be moved to the start of the editor state
 * 
 * @returns The modified editor state.
 */
const moveBlock = (
  state: BlockState[],
  blockId: string,
  afterId?: string,
): BlockState[] => {
  const block = state.find((b) => b.id === blockId);

  if (!block) {
    throw new Error(`Attempted to move non-existent block with ID "${blockId}".`);
  }

  return addBlock(
    removeBlock(state, blockId),
    block,
    afterId
  );
};

export default moveBlock;