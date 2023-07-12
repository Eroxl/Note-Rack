import type Block from "./Block";
import type { DataChangeEvents } from "./EditorEvent";

/**
 * Insert a block at a given index.
 * @param block The block to insert.
 * @param index The index to insert the block at.
 */
type InsertBlockHandler = (
  block: Omit<Block, '_id'>,
  index: number
) => void;

/**
 * Remove a block at a given index.
 * @param index The index to remove the block at.
 * @param blockID Optional ID of the block to remove (only used to verify that the block at the given index is the correct one).
 * 
 * @throws Error if the block at the given index does not have the same ID
 */
type RemoveBlockHandler = (
  index: number,
  blockID?: string
) => void;

/**
 * Change a block at a given index's type.
 * @param index The index to change the block at.
 * @param blockType The new block type.
 * @param blockID Optional ID of the block to change (only used to verify that the block at the given index is the correct one).
 * 
 * @throws Error if the block at the given index does not have the same ID
 */
type ChangeBlockTypeHandler = (
  index: number,
  blockType: string,
  blockID?: string
) => void;

/**
 * Change a block at a given index's data.
 * @param index The index to change the block at.
 * @param blockData The new block data.
 * @param blockID Optional ID of the block to change (only used to verify that the block at the given index is the correct one).
 * 
 * @throws Error if the block at the given index does not have the same ID
 * @throws Error if the block diff type is not supported
 */
type ChangeBlockDataHandler = (
  index: number,
  changes: DataChangeEvents[],
  blockID?: string
) => void;

export default interface EditorEventEmitters {
  insertBlock: InsertBlockHandler;
  removeBlock: RemoveBlockHandler;
  changeBlockType: ChangeBlockTypeHandler;
  changeBlockData: ChangeBlockDataHandler;
}