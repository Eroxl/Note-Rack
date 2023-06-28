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
    for (let i = 0; i < inlineTextKeybinds.length; i++) {
      const bind = inlineTextKeybinds[i];
  
      const regexSearch = bind.keybind.exec(element.textContent || '');

      if (!regexSearch || !regexSearch[2].length) continue;

      let currentLength = 0;
      const treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);

      let blocksContainingRegex: Node[] = [];

      // ~ Find the text nodes that contains the regex
      while (treeWalker.nextNode()) {
        const length = treeWalker.currentNode.textContent?.length || 0;

        // ~ All of the text nodes the regex could be in have been found
        if (currentLength > regexSearch.index) {
          break;
        }

        if (currentLength + length >= regexSearch.index) {
          blocksContainingRegex.push(treeWalker.currentNode)
          continue;
        }

        currentLength += length;
      }

      console.log(blocksContainingRegex);

      // ~ Render the inline block
      blocksContainingRegex.forEach((node) => {
        if (!node.parentElement || !node.textContent) return;

        currentLength += node.textContent.length;

        let parentElement = node.parentElement;

        // ~ If the node is entirely contained in the regex
        //   no calculations are needed and the style can be applied
        if (
          currentLength - node.textContent.length >= regexSearch.index
          && currentLength <= regexSearch.index + regexSearch[0].length
        ) {
          // ~ Walk up the tree until we find the node who's parent is
          //   the `editableRef` and add the bind type to it
          let topElement = node.parentElement;

          while (topElement.parentElement !== editableRef.current && topElement !== editableRef.current) {
            if (!topElement.parentElement) break;

            topElement = topElement.parentElement;
          }
          
          const currentStyle = topElement.getAttribute('data-inline-type')
          
          // ~ If the node doesn't have a style assume it's a text node
          //   and create a new span to contain the inline block
          if (!currentStyle || topElement === editableRef.current) {
            const newSpan = document.createElement('span');
            newSpan.setAttribute('data-inline-type', JSON.stringify([bind.type]));
            newSpan.classList.add(InlineTextStyles[bind.type]);
            newSpan.textContent = node.textContent;

            // ~ If the node is the editableRef, remove only the node
            //   and append the new span. Otherwise, replace the node
            //   with the new span
            if (topElement === editableRef.current) {
              topElement.replaceChild(newSpan, node);
              return;
            }

            topElement.replaceWith(newSpan);
            return;
          }

          // ~ If the node already has a style, add the new style to it
          const newStyle = JSON.parse(currentStyle);

          // ~ Just in case the style is not an array for some reason
          if (!Array.isArray(newStyle)) return;

          newStyle.push(bind.type);
          topElement.classList.add(InlineTextStyles[bind.type]);
          topElement.setAttribute('data-inline-type', JSON.stringify(newStyle));
    
          return;
        }

        // ~ If the node is not entirely contained in the regex
        //   we need to split the node into 2-3 parts

        // ~ Create a new text node to contain the text after the regex
        const nonRegexText = node.textContent.substring(
          regexSearch.index + regexSearch[0].length - currentLength + node.textContent.length,
        );

        const nonRegexTextNode = document.createTextNode(nonRegexText);
        
        parentElement.insertBefore(nonRegexTextNode, node.nextSibling);

        // ~ Create a new span to contain the inline block
        const newSpan = document.createElement('span');
        newSpan.classList.add(InlineTextStyles[bind.type]);

        const startingPosition = regexSearch.index - (currentLength - node.textContent.length);

        const endingPosition = Math.min(startingPosition + regexSearch[0].length - regexSearch[1]?.length, node.textContent.length)
        
        newSpan.textContent = node.textContent.substring(
          startingPosition + regexSearch[1]?.length,
          endingPosition,
        )

        newSpan.setAttribute('data-inline-type', JSON.stringify([bind.type]));
        parentElement.insertBefore(newSpan, node.nextSibling);

        // ~ If there is non regex text before the regex
        if (regexSearch.index > currentLength - node.textContent.length) {     
          const nonRegexTextLength = regexSearch.index - (currentLength - node.textContent.length);
          
          const nonRegexText = node.textContent.substring(0, nonRegexTextLength);

          const nonRegexTextNode = document.createTextNode(nonRegexText);
          
          parentElement.replaceChild(nonRegexTextNode, node);
        }

        // ~ If the node still has text, remove it
        node?.parentElement?.removeChild(node);
      });

      // ~ Assume only one match per execution
      break;
    }
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
        type: JSON.parse(type),
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
