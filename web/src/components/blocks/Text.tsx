import React, { useState, useEffect } from 'react';

import { updateServer } from '../../lib/pageController';
import { textKeybinds, stylingLookupTable } from '../../constants/textTypes';

const Text = (
  props: {
    properties: {
      value: string
    },
    page: string,
    blockID: string,
    index: number,
    type: string,
    addBlockAtIndex: (index: number) => void,
  },
) => {
  const {
    properties,
    page,
    blockID,
    index,
    type,
    addBlockAtIndex,
  } = props;
  const { value } = properties;
  const [currentBlockType, setCurrentBlockType] = useState('');

  useEffect(() => {
    setCurrentBlockType(type);
  }, [type]);

  const handlePotentialTypeChange = (text: string, element: HTMLSpanElement) => {
    Object.keys(textKeybinds).forEach((key) => {
      if (text.startsWith(`${key}&nbsp;`)) {
        element.innerText = text.slice(key.length + 6);
        setCurrentBlockType(textKeybinds[key]);
      } else if (text.startsWith(`${key} `)) {
        element.innerText = text.slice(key.length + 1);
        setCurrentBlockType(textKeybinds[key]);
      } else {
        return;
      }

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
            addBlockAtIndex(index + 1);
          } else if (e.code === 'Backspace' && currentBlockType !== 'text' && window.getSelection()?.anchorOffset === 0) {
            setCurrentBlockType('text');
            updateServer(blockID, 'text', undefined, undefined, page);
          }
        }
      }
    >
      {value}
    </span>
  );
};

export default Text;
