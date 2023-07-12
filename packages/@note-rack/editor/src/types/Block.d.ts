/**
 * The base type for a block.
 */
type Block = {
  /**
   * The ID of the block.
   */
  _id: string;

  /**
   * The type of the block.
   */
  blockType: string;

  /**
   * The properties of the block (e.g. text, image URL, etc.).
   */
  properties: Record<string, unknown>;

  /**
   * The children of the block (mostly used for lists).
   */
  children?: Block[];
};

export default Block;
