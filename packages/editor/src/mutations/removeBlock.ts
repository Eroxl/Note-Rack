import type BlockState from "../types/BlockState";

/**
 * Remove a block from the editor state.
 * @param state The editor state to modify.
 * @param blockId The ID of the block to remove.
 * 
 * @returns The modified editor state.
 */
const removeBlock = (
  state: BlockState[],
  blockId: string,
): BlockState[] => {
  const newState = [...state];

  const blockIndex = newState.findIndex((b) => b.id === blockId);

  if (blockIndex === -1) {
    throw new Error(`Attempted to remove non-existent block with ID "${blockId}".`);
  }

  newState.splice(blockIndex, 1);

  return newState;
};

export default removeBlock;
