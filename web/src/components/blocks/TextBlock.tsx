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
import { getCursorOffset } from '../../lib/helpers/caretHelpers';
import findNodesInRange from '../../lib/helpers/inlineBlocks/findNodesInRange';
import renderNewInlineBlocks from '../../lib/helpers/inlineBlocks/renderNewInlineBlocks';

const TextBlock = (props: EditableText) => {
  const {
    properties,
    page,
    type,
    index,
    blockID,
    setCurrentBlockType,
  } = props;

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
    if (!editableRef.current) return;

    const cursorOffset = getCursorOffset(element);
    let updatedCursorOffset = 0;

    for (let i = 0; i < inlineTextKeybinds.length; i++) {
      const bind = inlineTextKeybinds[i];
  
      const regexSearch = bind.keybind.exec(element.textContent || '');

      if (!regexSearch || !regexSearch[2].length) continue;

      const nodesInRange = findNodesInRange(
        element,
        {
          start: regexSearch.index,
          end: regexSearch.index + regexSearch[0].length,
        }
      )

      renderNewInlineBlocks(
        nodesInRange.nodes,
        InlineTextStyles[bind.type],
        bind.type,
        nodesInRange.startOffset,
        {
          start: regexSearch.index,
          end: regexSearch.index + regexSearch[0].length,
          bindLength: regexSearch[1].length,
        },
        editableRef.current,
      )

      // ~ Handle correctly moving the cursor to the same spot after
      //   the inline block is rendered

      // ~ If the cursor is before the match, do nothing
      if (regexSearch?.index > cursorOffset) break;

      // ~ If the cursor is in the middle of the match, subtract the
      //   length of the keybind from the cursor offset, otherwise
      //   subtract the length of the keybind times 2.
      const isAfterFullMatch = regexSearch?.index + regexSearch?.[0]?.length >= cursorOffset;

      updatedCursorOffset = (regexSearch?.[1]?.length || 0) * (isAfterFullMatch ? 2 : 1);
      break;
    }

    // ~ Update the cursor position
    if (updatedCursorOffset !== 0 && editableRef.current) {
      const range = document.createRange();
      const sel = window.getSelection()!;
      
      let nodeToSelect: Node | null = editableRef.current;

      const walker = document.createTreeWalker(nodeToSelect, NodeFilter.SHOW_TEXT, null);

      const offset = cursorOffset - updatedCursorOffset;
      let currentOffset = 0;

      while (walker.nextNode()) {
        const node = walker.currentNode;

        if (currentOffset + node.textContent?.length! >= offset) {
          if (node.textContent?.length! === offset - currentOffset) {
            nodeToSelect = walker.nextNode();
            currentOffset = offset;
            break;
          }

          nodeToSelect = node;
          break;
        }

        currentOffset += node.textContent?.length!;
      }

      if (!nodeToSelect) return;

      range.setStart(nodeToSelect, offset - currentOffset);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const handlePotentialTypeChange = async (element: HTMLSpanElement) => {
    textKeybinds.forEach(async (bind) => {
      if (!editableRef.current) return;

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
    if (!isAllowedToEdit || !editableRef.current) return;
  
    const style: typeof properties.style = [];

    /**
     * Walk up the tree to get the full text style of the node
     * @param node The node to get the full text style of
     * @returns The full text style of the node
     */
    const getFullTextStyle = (node: Node): (keyof typeof InlineTextStyles)[] => {
      if (!editableRef.current) return [];

      let currentNode = node;
      let style: string[] = [];

      while (currentNode.parentElement && currentNode.parentElement !== editableRef.current) {
        currentNode = currentNode.parentElement;

        const type = (currentNode as HTMLElement).getAttribute('data-inline-type');

        if (!type) continue;

        style.push(...JSON.parse(type));
      }

      return style as (keyof typeof InlineTextStyles)[];
    };

    const treeWalker = document.createTreeWalker(
      editableRef.current,
      NodeFilter.SHOW_TEXT,
      null
    );

    let length = 0;

    while (treeWalker.nextNode()) {
      const node = treeWalker.currentNode;

      if (!node.textContent) continue;

      length += node.textContent.length || 0;

      const type = getFullTextStyle(node);

      if (!type.length) continue;

      style.push({
        type,
        start: length - node.textContent.length,
        end: length,
      });
    }
    

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

  /**
   * Renders the inline blocks
   * @param value The text value
   * @param style The style of the text
   * @returns The rendered inline blocks
   */
  const renderInlineBlocks = (
    value: string,
    style: EditableText['properties']['style']
  ): (JSX.Element | string)[] | string => {
    if (!style) return properties.value;

    const blocks: (JSX.Element | string)[] = [];

    let start = 0;

    style.forEach((block) => {
      const text = value.substring(start, block.start);
      const inlineText = value.substring(block.start, block.end);

      if (text) {
        blocks.push(text);
      }

      blocks.push(
        <span
          className={block.type.map((type) => InlineTextStyles[type]).join(' ')}
          data-inline-type={JSON.stringify(block.type)}
        >
          {inlineText}
        </span>
      );

      start = block.end;
    });

    const text = value.substring(start);

    if (text) blocks.push(text);

    return blocks;
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
          } else if (e.code === 'ArrowUp' && isCaretAtTop(e.currentTarget) && editableRef.current) {
            handleKeyUp(
              e,
              index,
              pageData,
              editableRef.current,
            );
          } else if (e.code === 'ArrowDown' && isCaretAtBottom(e.currentTarget) && editableRef.current) {
            handleKeyDown(
              e,
              index,
              pageData,
              editableRef.current,
            );
          }
        }
      }
      data-cy="block-text"
    >
      {
        renderInlineBlocks(
          properties.value,
          properties.style
        )
      }
      {slashMenu}
    </span>
  );
};

export default TextBlock;
