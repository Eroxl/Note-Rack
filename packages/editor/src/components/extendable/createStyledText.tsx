import React, { useRef } from 'react';

import ContentEditable from '../ContentEditable';
import type BlockRenderer from '../../types/BlockRenderer';
import generateUUID from '../../helpers/generateUUID';
import getCursorOffset from '../../helpers/caret/getCursorOffset';

export type TextProperties = {
  text: string;
};

const createStyledText = (style?: React.CSSProperties, className?: string) => {
  const Text: BlockRenderer<TextProperties> = (props) => {
    const { id, properties, mutations, type } = props;
    const { text } = properties;
  
    const editableElement = useRef<HTMLSpanElement>(null);

    return (
      <ContentEditable
        style={{
          minHeight: '1.2em',
          outline: 'none',
          whiteSpace: 'pre-wrap',
          width: '100%',
          ...style
        }}

        className={className}
        html={text}
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
          } else if (event.code === 'Backspace' && type === 'text' && isBlockEmpty) {
            event.preventDefault();
            mutations.removeBlock(id);
          }
        }}
        onChange={() => {
          if (!editableElement.current) return;
  
          const updatedText = editableElement.current.innerText;
  
          mutations.editBlock(id, {
            text: updatedText
          })
        }}
      />
    )
  };

  return Text;
}

export default createStyledText;
