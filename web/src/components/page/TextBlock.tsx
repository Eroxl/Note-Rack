import React, { useState } from 'react';

import updateServer from '../../lib/updateServer';
import { stylingLookupTable, textKeybinds } from '../../constants/textTypes';

const TextBlock = (props: { blockID: string, page: string, value: string, typeOfText: string }) => {
  const {
    blockID,
    page,
    value,
    typeOfText,
  } = props;
  const [currentType, setCurrentType] = useState(typeOfText);

  const handlePotentialTypeChange = (text: string, element: HTMLSpanElement) => {
    Object.keys(textKeybinds).forEach((key) => {
      if (text.startsWith(`${key}&nbsp;`)) {
        element.innerText = text.slice(key.length + 6);
        setCurrentType(textKeybinds[key]);
      } else if (text.startsWith(`${key} `)) {
        element.innerText = text.slice(key.length + 1);
        setCurrentType(textKeybinds[key]);
      } else {
        return;
      }

      updateServer(blockID, textKeybinds[key], undefined, undefined, page);
    });
  };

  return (
    <span
      className={`min-h-[1.2em] outline-none ${stylingLookupTable[currentType]}`}
      role="textbox"
      tabIndex={0}
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => {
        handlePotentialTypeChange(e.currentTarget.innerHTML, e.currentTarget);
      }}
      onBlur={
        (e) => {
          updateServer(
            blockID,
            undefined,
            { value: e.currentTarget.innerHTML },
            undefined,
            page,
          );
        }
      }
      onKeyDown={
        (e) => {
          if (e.code === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            e.currentTarget.blur();
          } else if (e.code === 'Backspace' && !e.currentTarget.innerHTML && currentType !== 'text') {
            setCurrentType('text');
            updateServer(blockID, 'text', undefined, undefined, page);
          }
        }
      }
    >
      {value}
    </span>
  );
};

export default TextBlock;
