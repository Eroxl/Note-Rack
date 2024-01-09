import type BlockState from "../types/BlockState";

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
  state: BlockState[],
  blockId: string,
  updatedProperties?: Record<string, unknown>,
  updatedType?: string,
): BlockState[] => {
  const newState: BlockState[] = [...state];

  const blockIndex = newState.findIndex((b) => b.id === blockId);

  const block = newState[blockIndex];

  if (!block) {
    throw new Error(`Attempted to edit non-existent block with ID "${blockId}".`);
  }

  newState[blockIndex] = {
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
