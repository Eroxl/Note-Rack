import React, { useContext, useEffect } from 'react';

import { isCaretAtTop, isCaretAtBottom } from '../../lib/helpers/caretHelpers';
import { editBlock, addBlockAtIndex, removeBlock } from '../../lib/pages/updatePage';
import InlineTextStyles from '../../lib/constants/InlineTextStyles';
import TextStyles from '../../lib/constants/TextStyles';
import inlineTextKeybinds from '../../lib/inlineTextKeybinds';
import textKeybinds from '../../lib/textKeybinds';
import type { EditableText } from '../../lib/types/blockTypes';
import handleKeyDown from '../../lib/blockNavigation/handleKeyDown';
import handleKeyUp from '../../lib/blockNavigation/handleKeyUp';
import PageContext from '../../contexts/PageContext';
import useSlashMenu, { createDefaultSlashMenuCategories } from '../../hooks/useSlashMenu';

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

  const [editableRef, slashMenu] = useSlashMenu(
    createDefaultSlashMenuCategories(
      async (type) => {
        const bind = textKeybinds.find((bind) => bind.type === type);

        let newBlockProperties;

        if (bind?.customFunc) {
          newBlockProperties = await bind.customFunc(
            {
              ...properties,
              value: editableRef.current?.innerText,
            },
            blockID,
            page,
            editableRef.current,
          );
        }

        await editBlock([blockID], type, newBlockProperties, page);
        setCurrentBlockType(type);
      },
    ),
  );

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

  const saveBlock = (element: HTMLSpanElement) => {
    if (!isAllowedToEdit) return;

    const treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);

    const textNodes = [];

    while (treeWalker.nextNode()) {
      textNodes.push(treeWalker.currentNode);
    }

    const text = textNodes.map((node) => {
      const keybind = node.parentElement?.getAttribute('data-keybinds');

      return `${keybind}${node.textContent}${keybind}`;
    }).join('');

    editBlock([blockID], undefined, { value: text }, page);
  };

  const renderInlineBlocks = (value: string) => {
    const values = [{
      value,
      style: [] as string[],
      plaintTextBind: [] as string[],
    }];

    let hasParsedAllInlineBlocks = false;

    while (!hasParsedAllInlineBlocks) {
      hasParsedAllInlineBlocks = true;

      inlineTextKeybinds.forEach((bind) => {
        values.forEach((value, index) => {
            const regexSearch = bind.keybind.exec(value.value);

            if (!regexSearch || value.value === '') return;

            hasParsedAllInlineBlocks = false;

            const before = value.value.slice(0, regexSearch.index);
            const after = value.value.slice(regexSearch.index + regexSearch[0].length);

            values[index] = {
              value: regexSearch[2] ?? '',
              style: [...value.style, InlineTextStyles[bind.type]],
              plaintTextBind: [...value.plaintTextBind, bind.plainTextKeybind],
            }
            
            if (before) {
              values.splice(index, 0, {
                value: before,
                style: value.style,
                plaintTextBind: value.plaintTextBind,
              });
            }

            if (!after) return;

            values.splice(index + 1, 0, {
              value: after,
              style: value.style,
              plaintTextBind: value.plaintTextBind,
            });
          });
      });
    };

    return values.map((value, index) => (
      <span
        className={value.style.join(' ')}
        key={index}
        data-keybinds={value.plaintTextBind.join('')}
      >
        {value.value}
      </span>
    ));
  }

  return (
    <span
      className={`min-h-[1.2em] outline-none relative whitespace-pre-wrap w-full ${TextStyles[type]}`}
      role="textbox"
      tabIndex={0}
      contentEditable={isAllowedToEdit}
      suppressContentEditableWarning
      ref={isAllowedToEdit ? editableRef : undefined}
      id={blockID}
      onInput={(e) => {
        handlePotentialTypeChange(e.currentTarget);
      }}
      onBlur={
        (e) => {
          // if (!isAllowedToEdit) return;

          // editBlock([blockID], undefined, { value: e.currentTarget.innerText }, page);
          saveBlock(e.currentTarget);
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
      {renderInlineBlocks(value)}
      {slashMenu}
    </span>
  );
};

export default TextBlock;
