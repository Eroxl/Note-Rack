import React, { useContext } from 'react';

import { isCaretAtTop, isCaretAtBottom } from '../../lib/helpers/caretHelpers';
import { editBlock, addBlockAtIndex, removeBlock } from '../../lib/pages/updatePage';
import TextStyles from '../../lib/constants/TextStyles';
import textKeybinds from '../../lib/textKeybinds';
import type { EditableText } from '../../lib/types/blockTypes';
import handleKeyDown from '../../lib/blockNavigation/handleKeyDown';
import handleKeyUp from '../../lib/blockNavigation/handleKeyUp';
import PageContext from '../../contexts/PageContext';

const TextBlock = (props: EditableText) => {
  const {
    properties,
    page,
    type,
    index,
    blockID,
    setCurrentBlockType,
  } = props;
  const { value } = properties;

  const { pageData, setPageData } = useContext(PageContext);

  const isAllowedToEdit = pageData?.userPermissions.write || false;

  const handlePotentialTypeChange = async (element: HTMLSpanElement) => {
    textKeybinds.forEach(async (bind) => {
      const regexSearch = bind.keybind.exec(element.textContent || '');

      if (!regexSearch) return;

      element.textContent = regexSearch[1] ?? '';

      let newBlockProperties;

      if (bind.customFunc) {
        newBlockProperties = await bind.customFunc(
          {
            ...properties,
            value: element.textContent,
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
      contentEditable={isAllowedToEdit}
      suppressContentEditableWarning
      id={blockID}
      onInput={(e) => {
        handlePotentialTypeChange(e.currentTarget);
      }}
      onBlur={
        (e) => {
          if (!isAllowedToEdit) return;

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
            removeBlock(index, [blockID], page, pageData, setPageData, true);
          } else if (e.code === 'ArrowUp' && isCaretAtTop(e.currentTarget)) {
            handleKeyUp(
              e,
              index,
              pageData,
            );
          } else if (e.code === 'ArrowDown' && isCaretAtBottom(e.currentTarget)) {
            handleKeyDown(
              e,
              index,
              pageData,
            );
          }
        }
      }
      data-cy="block-text"
    >
      {value}
    </span>
  );
};

export default TextBlock;
