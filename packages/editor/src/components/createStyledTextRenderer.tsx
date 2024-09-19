import React, { useRef } from 'react';

import ContentEditable from './ContentEditable';
import getCursorOffset from '../lib/helpers/caret/getCursorOffset';
import focusElement from '../lib/helpers/focusElement';
import generateUUID from '../lib/helpers/generateUUID';
import type BlockRenderer from '../types/BlockRenderer';

import renderInlineBlocks from '../lib/helpers/inlineBlocks/renderInlineBlocks';
import saveInlineBlocks from '../lib/helpers/inlineBlocks/saveInlineBlocks';
import { InlineBlock } from '../lib/helpers/inlineBlocks/renderInlineBlocks';

export type TextProperties = {
  text: string;
  style?: InlineBlock[],
};

/**
 * Create a styled text block renderer
 * @param style The style to apply to the text
 * @param className The class name to apply to the text
 * @returns The styled text block renderer
 * 
 * @example
 * ```tsx
 * import React from 'react';
 * import ReactDOM from 'react-dom';
 * 
 * import { Editor } from '@note-rack/editor';
 * import { createStyledTextRenderer } from '@note-rack/editor';
 * 
 * const redTextRenderer = createStyledTextRenderer({
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
const createStyledTextRenderer = (
  style?: React.CSSProperties,
  className?: string,
) => {
  const Text: BlockRenderer<TextProperties> = (props) => {
    const { id, properties, mutations, type, inlineBlocks } = props;
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
          renderInlineBlocks(
            text,
            mutations,
            id,
            inlineBlockStyles,
            inlineBlocks,
          )
        }
      </ContentEditable>
    )
  };

  return Text;
}

export default createStyledTextRenderer;