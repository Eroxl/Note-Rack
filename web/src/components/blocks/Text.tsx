import React, { useState, useEffect } from 'react';

import updateServer from '../../lib/updateServer';
import { textKeybinds, stylingLookupTable } from '../../constants/textTypes';
import { EditableText } from '../../lib/types/blockTypes';

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

  const handlePotentialTypeChange = (element: HTMLSpanElement) => {
    textKeybinds.forEach((bind) => {
      const regexSearch = bind.keybind.exec(element.innerText);
      if (!regexSearch) return;

      element.innerText = regexSearch[1] ?? '';
      setCurrentBlockType(bind.type);

      if (bind.customFunc) {
        const { properties: newBlockProperties, style: newBlockStyle } = bind.customFunc(
          properties,
          blockID,
          page,
          element,
        );

        updateServer(blockID, bind.type, newBlockProperties, newBlockStyle, page);
        return;
      }

      updateServer(blockID, bind.type, undefined, undefined, page);
    });
  };

  return (
    <span
      className={`min-h-[1.2em] outline-none whitespace-pre-wrap ${stylingLookupTable[currentBlockType]}`}
      role="textbox"
      tabIndex={0}
      contentEditable
      suppressContentEditableWarning
      id={blockID}
      onInput={(e) => {
        handlePotentialTypeChange(e.currentTarget);
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
          if (e.code === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            e.currentTarget.blur();
            addBlockAtIndex();
          } else if (e.code === 'Backspace' && currentBlockType !== 'text' && window.getSelection()?.anchorOffset === 0) {
            setCurrentBlockType('text');
            updateServer(blockID, 'text', undefined, undefined, page);
          } else if (e.code === 'Backspace' && currentBlockType === 'text' && (e.currentTarget.innerText === '' || e.currentTarget.innerText === '\n')) {
            removeBlock();
          }
        }
      }
      onCopy={() => {
        navigator.clipboard.writeText(window.getSelection()?.toString() || '');
      }}
    >
      {value}
    </span>
  );
};

export default Text;
