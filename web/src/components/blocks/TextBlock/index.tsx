import React, { useState, useEffect } from 'react';
import rangy from 'rangy';

import getTextRepresentation from './getTextRepresentation';
import renderInlineBlocks from './renderInlineBlocks';
import handlePotentialTypeChange from './handlePotentialTypeChange';
import { editBlock, addBlockAtIndex, removeBlock } from '../../../lib/pages/updatePage';
import TextStyles from '../../../constants/TextStyles';
import type { EditableText } from '../../../types/blockTypes';

const TextBlock = (props: EditableText) => {
  const {
    properties,
    page,
    type,
    index,
    blockID,
    pageData,
    setPageData,
    setCurrentBlockType,
  } = props;
  const { value } = properties;
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  return (
    <span
      className={`min-h-[1.2em] outline-none whitespace-pre-wrap w-full ${TextStyles[type]}`}
      role="textbox"
      tabIndex={0}
      contentEditable
      suppressContentEditableWarning
      id={blockID}
      onInput={(e) => {
        handlePotentialTypeChange(e.currentTarget, properties, blockID, page, setCurrentBlockType);
        
        const getCursorPosition = () => {
          const selection = rangy.getSelection();
          const range = selection.getRangeAt(0);
          const rangeClone = range.cloneRange();
          rangeClone.selectNodeContents(e.currentTarget);
          rangeClone.setEnd(range.endContainer, range.endOffset);
          const offset = rangeClone.toString().length;

          return offset;
        }

        const cursorPosition = getCursorPosition();
      }}
      onBlur={
        (e) => {
          editBlock([blockID], undefined, {
            value: getTextRepresentation(e.currentTarget) || '',
          }, page);
        }
      }
      onKeyDown={
        (e) => {
          if (e.code === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            e.currentTarget.blur();
            addBlockAtIndex(index + 1, page, pageData, setPageData);
          } else if (e.code === 'Backspace' && type !== 'text' && window.getSelection()?.anchorOffset === 0) {
            setCurrentBlockType('text');
            editBlock([blockID], 'text', undefined, page);
          } else if (e.code === 'Backspace' && type === 'text' && (e.currentTarget.innerText === '' || e.currentTarget.innerText === '\n')) {
            removeBlock(index, [blockID], page, pageData, setPageData);
          }
        }
      }
      data-cy="block-text"
    >
      {renderInlineBlocks(currentValue)}
    </span>
  );
};

export default TextBlock;
