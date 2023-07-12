import type Block from "./Block"

/**
 * The event emitted when a block is added to the editor.
 */
export type Addition = {
  /**
   * The type of event.
   */
  type: 'addition',

  /**
   * The block that was added.
   * @see Block
   */
  block: Block,

  /**
   * The ID of the block that was added.
   * @see Block._id
   */
  blockID: Block['_id'],

  /**
   * The index of the block that was added.
   */
  index: number,
}

/**
 * The event emitted when a block is deleted from the editor.
 */
export type Deletion = {
  /**
   * The type of event.
   */
  type: 'deletion',

  /**
   * The ID of the block that was deleted.
   * @see Block._id
   */
  blockID: Block['_id'],

  /**
   * The index of the block that was deleted.
   */
  index: number,
}

/**
 * The event emitted when a block's type is changed.
 */
export type TypeChange = {
  /**
   * The type of event.
   */
  type: 'blockTypeChange',

  /**
   * The index of the block that was changed.
   */
  index: number,

  /**
   * The ID of the block that was changed.
   * @see Block._id
   */
  blockID: Block['_id'],

  /**
   * The new type of the block.
   */
  newBlockType: Block['blockType'],
}

/**
 * The changes that occured to a block's data object.
 */
export type DataChangeEvents = (
  {
    /**
     * The key of the data that was changed.
     */
    key: string,
  } & (
    {
      /**
       * The type of change that was made.
       */
      type: 'deletion',
    } | {
      /**
       * The type of change that was made.
       */
      type: 'addition',

      /**
       * The value that was added.
       */
      value: string,
    } | {
      /**
       * The type of change that was made.
       */
      type: 'change',

      /**
       * A diff object representing the change that was made.
       */
      diff: (
        {
          /**
           * The type of change that was made.
           */
          type: 'addition',

          /**
           * The position at which the addition was made.
           */
          position: number,

          /**
           * The value that was added.
           */
          value: string,
        }
        | {
          /**
           * The type of change that was made.
           */
          type: 'deletion',

          /**
           * The position at which the deletion was made.
           */
          position: number,

          /**
           * The length of the deletion.
           */
          length: number,
        }
      )
    }
  )
)

/**
 * The event emitted when a block's data is changed.
 */
export type DataChange = {
  /**
   * The type of event.
   */
  type: 'blockDataChange',
  
  /**
   * The ID of the block that was changed.
   * @see Block._id
   */
  blockID: Block['_id'],

  /**
   * The index of the block that was changed.
   */
  index: number,

  /**
   * The changes that were made to the block's data.
   */
  events: DataChangeEvents[],
}

/**
 * The event emitted when the editor state changes.
 */
type EditorEvent = Addition | Deletion | TypeChange | DataChange

export default EditorEvent
