import React, { useRef } from 'react';

import ContentEditable from './ContentEditable';
import type BlockRenderer from '../types/BlockRenderer';

export type TextProperties = {
  text: string;
};

const Text: BlockRenderer<TextProperties> = (props) => {
  const { id, properties, mutations } = props;
  const { text } = properties;

  const editableElement = useRef<HTMLSpanElement>(null);

  return (
    <ContentEditable
      style={{
        minHeight: '1.2em',
        outline: 'none',
        whiteSpace: 'pre-wrap',
        width: '100%',
      }}
      html={text}
      innerRef={editableElement}
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

export default Text;
