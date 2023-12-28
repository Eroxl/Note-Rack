import React, { useRef } from 'react';

import ContentEditable from '../ContentEditable';
import type BlockRenderer from '../../types/BlockRenderer';
import generateUUID from '../../lib/helpers/generateUUID';
import getCursorOffset from '../../lib/helpers/caret/getCursorOffset';
import focusElement from 'src/lib/helpers/focusElement';
import type InlineBlockRenderer from 'src/types/InlineBlockRenderer';
import renderInlineBlocks from 'src/lib/renderInlineBlocks';

export type TextProperties = {
  text: string;
  style?: {
    type: string[],
    start: number,
    end: number,
  }[],
};

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

            setTimeout(() => {
              if (!editableElement.current) return;

              const nextBlock = editableElement.current.nextSibling as HTMLElement | null;

              if (!nextBlock) return;

              focusElement(nextBlock);
            }, 0);
          } else if (event.code === 'Backspace' && type !== 'text' && isCursorAtStart) {
            event.preventDefault();
            mutations.editBlock(id, {}, 'text');

            setTimeout(() => {
              const newBlock = document.getElementById(`block-${id}`)?.firstChild as (HTMLElement | undefined);

              if (!newBlock) return;

              focusElement(newBlock, 0);
            }, 0);
          } else if (event.code === 'Backspace' && type === 'text' && isBlockEmpty) {
            event.preventDefault();
            mutations.removeBlock(id);
          }
        }}
        onChange={() => {
          if (!editableElement.current) return;
  
          const updatedText = editableElement.current.textContent;
  
          mutations.editBlock(id, {
            text: updatedText
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
