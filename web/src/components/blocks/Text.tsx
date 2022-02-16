import React, { useState, useEffect } from 'react';

import { updateServer } from '../../lib/pageController';
import { textKeybinds, stylingLookupTable } from '../../constants/textTypes';
import { EditableText } from '../../lib/types/blockTypes';
import { moveCursor, getCursor } from '../../lib/cursor/cursorHelper';

const Text = (props: EditableText) => {
  const {
    properties,
    page,
    blockID,
    type,
    addBlockAtIndex,
    removeBlock,
  } = props;
  const { value } = properties;
  const [currentBlockType, setCurrentBlockType] = useState('');

  useEffect(() => {
    setCurrentBlockType(type);
  }, [type]);

  const handlePotentialTypeChange = (text: string, element: HTMLSpanElement) => {
    Object.keys(textKeybinds).forEach((key) => {
      if (!(text.startsWith(`${key}&nbsp;`) || text.startsWith(`${key} `))) return;

      element.innerText = element.innerText.slice(key.length + 1);
      setCurrentBlockType(textKeybinds[key]);

      updateServer(blockID, textKeybinds[key], undefined, undefined, page);
    });
  };

  return (
    <span
      className={`min-h-[1.2em] outline-none ${stylingLookupTable[currentBlockType]}`}
      role="textbox"
      tabIndex={0}
      contentEditable
      suppressContentEditableWarning
      id={blockID}
      onInput={(e) => {
        handlePotentialTypeChange(e.currentTarget.innerHTML, e.currentTarget);
      }}
      onBlur={
        (e) => {
          updateServer(
            blockID,
            undefined,
            { value: e.currentTarget.innerText },
            undefined,
            page,
          );
        }
      }
      onKeyDown={
        (e) => {
          if (e.code === 'Enter') {
            e.preventDefault();
            e.currentTarget.blur();
            addBlockAtIndex();
          } else if (e.code === 'Backspace' && currentBlockType !== 'text' && window.getSelection()?.anchorOffset === 0) {
            setCurrentBlockType('text');
            updateServer(blockID, 'text', undefined, undefined, page);
          } else if (e.code === 'Backspace' && currentBlockType === 'text' && e.currentTarget.innerText === '') {
            removeBlock();
          }
        }
      }
    >
      {value}
    </span>
  );
};

export default Text;
