import React, { useContext } from 'react';

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

  const handlePotentialInlineBlocks = async (element: HTMLSpanElement) => {
    inlineTextKeybinds.forEach(async (bind) => {
      const regexSearch = bind.keybind.exec(element.textContent || '');

      if (!regexSearch) return;

      let currentLength = 0;
      const treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);

      while (treeWalker.nextNode()) {
        const length = treeWalker.currentNode.textContent?.length || 0;

        if (currentLength + length >= regexSearch.index) break;

        currentLength += length;
      }

      const textNode = treeWalker.currentNode;

      if (!textNode) return;

      const before = textNode.textContent?.slice(0, regexSearch.index - currentLength);

      if (before) {
        const newTextNode = document.createElement('span');
        newTextNode.textContent = before;

        if (textNode.parentElement?.classList.length) {
          newTextNode.classList.add(textNode.parentElement.className);
        }
        
        console.log(newTextNode.classList, newTextNode.textContent);
      }

      let newElementText = regexSearch[2] ?? ''

      while (newElementText.length > (treeWalker.nextNode()?.textContent?.length || 0) && treeWalker.currentNode) {
        const elementText = newElementText.slice(0, treeWalker.currentNode.textContent?.length || 0);
        newElementText = newElementText.slice(treeWalker.currentNode.textContent?.length || 0);

        console.log(
          treeWalker.currentNode.parentElement?.classList + ' ' + InlineTextStyles[bind.type],
          elementText,
        );
      }

      if (newElementText.length === 0) return;
      
    });
  };

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

  /**
   * Saves the block to the database
   * @param element The element to save
   */
  const saveBlock = (element: HTMLSpanElement) => {
    if (!isAllowedToEdit) return;
  
    const style: {
      type: string,
      start: number,
      end: number,
    }[] = [];

    const treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);

    const textNodes: Node[] = [];

    while (treeWalker.nextNode()) {
      textNodes.push(treeWalker.currentNode);
    }

    let length = 0;

    textNodes.forEach((node) => {
      if (!node.textContent || !node.parentElement) return;

      length += node.textContent.length || 0;

      const type = node.parentElement.getAttribute('data-inline-type');

      if (!type) return;

      style.push({
        type,
        start: length - node.textContent.length,
        end: length,
      });
    })

    editBlock(
      [blockID],
      undefined,
      {
        value: element.innerText,
        style,
      },
      page
    );
  };

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
        handlePotentialInlineBlocks(e.currentTarget);
      }}
      onBlur={
        (e) => { saveBlock(e.currentTarget); }
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
      {slashMenu}
    </span>
  );
};

export default TextBlock;
