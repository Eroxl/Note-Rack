import React from 'react';

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
      }}
      onBlur={
        (e) => {
          editBlock([blockID], undefined, {
            value: getTextRepresentation(e.currentTarget),
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
      {renderInlineBlocks(value)}
    </span>
  );
};

export default TextBlock;
