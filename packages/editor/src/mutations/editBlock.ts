import type BlockState from "../types/BlockState";
import EditorState from "../types/EditorState";

/**
 * Edit a block in the editor state.
 * @param state The editor state to modify.
 * @param block The block to edit.
 * @param updatedProperties The properties to update on the block.
 * @param updatedType The type to update on the block.
 * 
 * @returns The modified editor state.
 */
const editBlock = (
  state: EditorState,
  blockId: string,
  updatedProperties?: Record<string, unknown>,
  updatedType?: string,
): EditorState => {
  const newState = {
    ...state,
    blocks: [...state.blocks],
  };

  const blockIndex = newState.blocks.findIndex((b) => b.id === blockId);

  const block = newState.blocks[blockIndex];

  if (!block) {
    throw new Error(`Attempted to edit non-existent block with ID "${blockId}".`);
  }

  newState.blocks[blockIndex] = {
    ...block,
    properties: {
      ...block.properties,
      ...updatedProperties,
    },
    type: updatedType || block.type,
  };

  return newState;
}

export default editBlock;
