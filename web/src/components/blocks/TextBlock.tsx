import React from 'react';

import { editBlock, addBlockAtIndex, removeBlock } from '../../lib/pages/updatePage';
import TextStyles from '../../constants/TextStyles';
import textKeybinds from '../../lib/textKeybinds';
import type { EditableText } from '../../types/blockTypes';

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

  const handlePotentialTypeChange = async (element: HTMLSpanElement) => {
    textKeybinds.forEach(async (bind) => {
      const regexSearch = bind.keybind.exec(element.innerText);
      if (!regexSearch) return;

      element.innerText = regexSearch[1] ?? '';

      let newBlockProperties;

      if (bind.customFunc) {
        newBlockProperties = await bind.customFunc(
          {
            ...properties,
            value: element.innerText,
          },
          blockID,
          page,
          element,
        );
      }

      await editBlock([blockID], bind.type, newBlockProperties, page);
      setCurrentBlockType(bind.type);
    });
  };

  return (
    <span
      className={`min-h-[1.2em] outline-none whitespace-pre-wrap w-full ${TextStyles[type]}`}
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
          editBlock([blockID], undefined, { value: e.currentTarget.innerText }, page);
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
      onCopy={() => {
        navigator.clipboard.writeText(window.getSelection()?.toString() || '');
      }}
    >
      {value}
    </span>
  );
};

export default TextBlock;
