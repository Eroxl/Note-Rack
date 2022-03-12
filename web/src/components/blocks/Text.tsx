import React from 'react';

import { editBlock } from '../../lib/updatePage';
import { textKeybinds, stylingLookupTable } from '../../lib/textTypes';
import { EditableText } from '../../types/blockTypes';

const Text = (props: EditableText) => {
  const {
    properties,
    page,
    type,
    blockID,
    addBlockAtIndex,
    removeBlock,
    setCurrentBlockType,
  } = props;
  const { value } = properties;

  const handlePotentialTypeChange = async (element: HTMLSpanElement) => {
    textKeybinds.forEach(async (bind) => {
      const regexSearch = bind.keybind.exec(element.innerText);
      if (!regexSearch) return;

      element.innerText = regexSearch[1] ?? '';
      setCurrentBlockType(bind.type);

      if (bind.customFunc !== undefined) {
        const { properties: newBlockProperties } = bind.customFunc(
          properties,
          blockID,
          page,
          element,
        );

        await editBlock([blockID], bind.type, newBlockProperties, page);
        return;
      }

      await editBlock([blockID], bind.type, undefined, page);
    });
  };

  return (
    <span
      className={`min-h-[1.2em] outline-none whitespace-pre-wrap ${stylingLookupTable[type]}`}
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
          editBlock(
            [blockID],
            undefined,
            { value: e.currentTarget.innerText },
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
          } else if (e.code === 'Backspace' && type !== 'text' && window.getSelection()?.anchorOffset === 0) {
            setCurrentBlockType('text');
            editBlock([blockID], 'text', undefined, page);
          } else if (e.code === 'Backspace' && type === 'text' && (e.currentTarget.innerText === '' || e.currentTarget.innerText === '\n')) {
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
