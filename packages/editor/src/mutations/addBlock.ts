import type BlockState from "../types/BlockState";

/**
 * Add a block to the editor state.
 * @param state The editor state to modify.
 * @param block The block to add.
 * 
 * @param afterId The ID of the block to insert the new block after.
 * 
 * @returns The modified editor state.
 */
const addBlock = (
  state: BlockState[],
  block: BlockState,
  afterId?: string,
): BlockState[] => {
  const newState = [...state];

  if (!afterId) {
    newState.push(block);
    return newState;
  }

  const afterIndex = newState.findIndex((b) => b.id === afterId);

  if (afterIndex === -1) {
    throw new Error(`Attempted to insert block after non-existent block with ID "${afterId}".`);
  }

  newState.splice(afterIndex + 1, 0, block);

  return newState;
};

export default addBlock;