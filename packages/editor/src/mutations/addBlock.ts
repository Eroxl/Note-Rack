import BlockState from "../types/BlockState";
import EditorState from "../types/EditorState";

/**
 * Add a block to the editor state.
 * @param state The editor state to modify.
 * @param block The block to add.
 * @param afterId The ID of the block to insert the new block after.
 * 
 * @returns The modified editor state.
 */
const addBlock = (
  state: EditorState,
  block: BlockState,
  afterId?: string,
): EditorState => {
  const newState = {
    ...state,
    blocks: [...state.blocks],
  }

  if (!afterId) {
    newState.blocks.push(block);
    return newState;
  }

  const afterIndex = newState.blocks.findIndex((b) => b.id === afterId);

  if (afterIndex === -1) {
    throw new Error(`Attempted to insert block after non-existent block with ID "${afterId}".`);
  }

  newState.blocks.splice(afterIndex + 1, 0, block);

  return newState;
}

export default addBlock;