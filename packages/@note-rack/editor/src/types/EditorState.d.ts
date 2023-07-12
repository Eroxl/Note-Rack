import type Block from "./Block";
import type BlockComponent from "./BlockComponent";
import type EditorEvent from "./EditorEvent";

/**
 * The EditorState type is used to define the structure of the editor state.
 */
type EditorState = {
  /**
   * The types of blocks to be rendered in the editor.
   */
  blockTypes?: {
    /**
     * This component will be used if no component is defined for the block type.
     */
    '*': {
      /**
       * The component to be rendered for this block type.
       */
      component: BlockComponent,
    },
    [key: Block['blockType']]: {
      /**
       * The component to be rendered for this block type.
       */
      component: BlockComponent,

      /**
       * The keybinding to be used for this block type.
       */
      keybind?: {
        keybind: RegExp,
        plainTextKeybind: string,
      },
    },
  },

  /**
   * The data to be rendered in the editor.
   */
  data?: Block[],

  /**
   * Should the editor be rendered in read-only mode?
   */
  readOnly?: boolean,

  /**
   * Callback function to be called when the editor state changes.
   * @param changes The changes that were made to the editor state.
   */
  onChange?: (changes: EditorEvent[]) => void,
};

export default EditorState;
