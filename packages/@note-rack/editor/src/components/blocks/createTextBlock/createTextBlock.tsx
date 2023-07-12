import React, { useRef } from 'react';

import styles from './BaseTextBlock.module.css';
import type Block from '../../../types/Block';
import type { BlockComponentProps } from '../../../types/BlockComponent';
import getCursorOffset from '../../../helpers/caret/getCaretOffset';

/**
 * The base text block component that all styled text blocks inherit from.
 * @param props The text block's props.
 * @returns A component to render the text block.
 */
const createTextBlock = (className?: string, style?: React.CSSProperties) => (
  (props: BlockComponentProps) => {
    const {
      block,
      index,
      editorEventEmitters,
      readOnly,
    } = props;

    const {
      _id: blockID,
      blockType,
      properties,
    } = block;

    const {
      text,
    } = properties;

    const editableRef = useRef<HTMLSpanElement>(null);

    /**
     * Fix some issues with incorrect rendering of newlines.
     * @param text The text to format.
     * @returns The formatted text.
     */
    const formatText = (text: string) => {
      if (text.endsWith('\n')) return text;

      return `${text}\n`;
    }

    return (
      <div>
        <span
          className={`${styles.textBlock} ${className}`}
          style={style}
          tabIndex={0}
          role="textbox"
          contentEditable={!readOnly}
          suppressContentEditableWarning
          ref={readOnly ? undefined : editableRef}
          id={blockID}
          onKeyDown={(event) => {
            if (readOnly || !editableRef.current) return;

            // ~ Handle deletion events
            if (event.key === 'Backspace') {
              if (window.getSelection()?.anchorOffset === 0 && blockType !== '*') {
                editorEventEmitters.changeBlockType(index, '*', blockID);

                event.preventDefault();
              } else if (editableRef.current?.innerText === '' || editableRef.current?.innerText === '\n' && blockType === '*') {
                editorEventEmitters.removeBlock(index, blockID);

                event.preventDefault();
              }
            } else if (event.code === 'Enter' && !event.shiftKey) {
              event.preventDefault();

              const newBlock: Omit<Block, '_id'> = {
                blockType: 'text',
                properties: {},
                children: [],
              }

              editorEventEmitters.insertBlock(newBlock, index + 1);
            }

            // ~ Handle insertion events
            const selection = window.getSelection();

            if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey && selection?.isCollapsed) {
              editorEventEmitters.changeBlockData(
                index,
                [
                  {
                    key: 'text',
                    type: 'change',
                    diff: {
                      type: 'addition',
                      position: getCursorOffset(editableRef.current),
                      value: event.shiftKey
                        ? event.key.toUpperCase()
                        : event.key,
                    }
                  },
                ],
                blockID,
              )

              event.preventDefault();

              // ~ TODO: Put the cursor back in the correct place
            }
          }}

          data-block-id={blockID}
          data-block-index={index}
        >
          {formatText((text || '') as string)}
        </span>
      </div>
    );
  }
);

export default createTextBlock;
