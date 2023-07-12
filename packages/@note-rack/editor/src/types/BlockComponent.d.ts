import Block from "./Block";

import type { DataChange, TypeChange } from './EditorEvent';
import type EditorEventEmitters from "./EditorEventEmitters";

/**
 * The BlockComponentProps type is used to define the structure of the props of a block component.
 */
export type BlockComponentProps = {
  /**
   * The block to be rendered.
   */
  block: Block;

  /**
   * Function to be called when the block is changed.
   * @param events The events that caused the change.
   */
  onChange: (events: (DataChange | TypeChange)[]) => void;

  /**
   * The event handlers for the editor.
   */
  editorEventEmitters: EditorEventEmitters;

  /**
   * The index of the block in the editor.
   */
  index: number;

  /**
   * Whether or not to render the block in read-only mode.
   */
  readOnly?: boolean;
}

/**
 * The BlockComponent type is used to define the structure of a block component.
 */
type BlockComponent = (props: BlockComponentProps) => JSX.Element;

export default BlockComponent;
