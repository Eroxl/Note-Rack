import React from 'react';

import { updateServer } from '../../lib/pageController';
import { textKeybinds } from '../../constants/textTypes';

const Text = (
  props: {
    properties: {
      value: string
    },
    page: string,
    blockID: string,
    setCurrentBlockType: React.Dispatch<React.SetStateAction<string>>
  },
) => {
  const {
    properties,
    page,
    blockID,
    setCurrentBlockType,
  } = props;
  const { value } = properties;

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
      className="min-h-[1.2em] outline-none"
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
    >
      {value}
    </span>
  );
};

export default Text;
