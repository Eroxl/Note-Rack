import React, { useRef } from 'react';

import ContentEditable from '@note-rack/editor/components/ContentEditable';
import getCursorOffset from '@note-rack/editor/lib/helpers/caret/getCursorOffset';
import focusElement from '@note-rack/editor/lib/helpers/focusElement';
import generateUUID from '@note-rack/editor/lib/helpers/generateUUID';
import type BlockRenderer from '@note-rack/editor/types/BlockRenderer';

import renderInlineBlocks from './helpers/renderInlineBlocks';
import saveInlineBlocks from './helpers/saveInlineBlocks';
import InlineBlockRenderer from './types/InlineBlockRenderer';

export type TextProperties = {
  text: string;
  style?: {
    type: string[],
    start: number,
    end: number,
  }[],
};

/**
 * Create a styled text block renderer
 * @param type: The type of the block
 * @param style The style to apply to the text
 * @param className The class name to apply to the text
 * @param inlineBlocks The inline blocks that the text can contain
 * @returns The styled text block renderer
 * 
 * @see https://npmjs.com/package/@note-rack/editor/
 * 
 * @example
 * ```tsx
 * import React from 'react';
 * import ReactDOM from 'react-dom';
 * 
 * import { Editor } from '@note-rack/editor';
 * 
 * import { createStyledText } from '@note-rack/styled-text';
 * 
 * const redTextRenderer = createStyledText({
 *   color: 'red',
 * });
 * 
 * const RedTextExample: React.FC = () => (
 *   <Editor
 *     startingBlocks={[
 *       {
 *         id: 'example-block',
 *         type: 'red-text',
 *         properties: {
 *           text: 'Red text',
 *         }
 *       },
 *     ]}
 *     renderers={{
 *       'red-text': redTextRenderer,
 *     }}
 *   />
 * );
 * 
 * ReactDOM.render(
 *   <RedTextExample />,
 *   document.getElementById('root')
 * );
 * ```
 */
const createStyledText = (
  style?: React.CSSProperties,
  className?: string,
  inlineBlocks?: {
    [type: string]: InlineBlockRenderer,
  }
) => {
  const Text: BlockRenderer<TextProperties> = (props) => {
    const { id, properties, mutations, type } = props;
    const { text, style: inlineBlockStyles } = properties;
  
    const editableElement = useRef<HTMLSpanElement>(null);

    return (
      <ContentEditable
        style={{
          outline: 'none',
          whiteSpace: 'pre-wrap',
          maxWidth: '100vw',
          wordBreak: 'break-word',
          ...style
        }}

        className={className}
        innerRef={editableElement}
        onKeyDown={(event) => {
          if (!editableElement.current) return;

          const isCursorAtStart = getCursorOffset(editableElement.current) === 0;

          const isBlockEmpty = (editableElement.current.innerText === '' || editableElement.current.innerText === '\n');

          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();

            mutations.addBlock(
              {
                id: generateUUID(),
                type: 'text',
                properties: {
                  text: ''
                }
              },
              id
            );
          } else if (event.code === 'Backspace' && type !== 'text' && isCursorAtStart) {
            event.preventDefault();
            mutations.editBlock(id, {}, 'text');

            setTimeout(() => {
              const newBlock = document.getElementById(`block-${id}`)?.firstChild as (HTMLElement | undefined);

              if (!newBlock) return;

              focusElement(newBlock, 0);
            }, 7);
          } else if (event.code === 'Backspace' && type === 'text' && isBlockEmpty) {
            event.preventDefault();
            mutations.removeBlock(id);
          }
        }}
        onChange={() => {
          if (!editableElement.current) return;
  
          const updatedText = editableElement.current.textContent || '';

          mutations.editBlock(id, {
            text: updatedText,
            style: saveInlineBlocks(editableElement.current)
          })
        }}
      >
        {
          renderInlineBlocks(text, inlineBlockStyles, inlineBlocks)
        }
      </ContentEditable>
    )
  };

  return Text;
}

export default createStyledText;