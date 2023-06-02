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

  const saveBlock = (element: HTMLSpanElement) => {
    if (!isAllowedToEdit) return;

    const treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);

    const textNodes = [];

    while (treeWalker.nextNode()) {
      textNodes.push(treeWalker.currentNode);
    }

    const text = textNodes.map((node) => {
      const keybind = node.parentElement?.getAttribute('data-keybinds') || '';

      return `${keybind}${node.textContent}${keybind}`;
    }).join('');

    editBlock([blockID], undefined, { value: text }, page);
  };

  const renderInlineBlocks = (value: string) => {
    const values: {
      start: number;
      end: number;
      binds: string[];
      types: (keyof typeof InlineTextStyles)[];
    }[] = [];

    inlineTextKeybinds.forEach((bind) => {
      const regexSearch = bind.keybind.exec(value);

      if (!regexSearch || value === '') return;

      values.push({
        start: regexSearch.index,
        end: regexSearch.index + regexSearch[0].length,
        types: [bind.type],
        binds: [bind.plainTextKeybind]
      });

      const padding = '\\'.repeat(bind.plainTextKeybind.length)
      value = value.replace(regexSearch[0], `${padding}${regexSearch[2] ?? ''}${padding}`);
    });

    /**
     * Merge the binds and style of overlapping inline blocks
     * in place
     * @param valuesToMerge The values to merge
     */
    const mergeOverlapping = (valuesToMerge: typeof values): void => {
      let didMerge = true;

      while (didMerge) {
        didMerge = false;

        let newValuesToMerge: typeof valuesToMerge = [];

        valuesToMerge.sort((a, b) => a.start - b.start);

        valuesToMerge.forEach((value, index) => {
          const nextValue = valuesToMerge[index + 1];

          if (!nextValue) return;

          // ~ The value is overlapping the next value
          if (value.end >= nextValue.start) {
            // ~ The next value is completely inside the current value
            if (value.end >= nextValue.end) {
              nextValue.binds.push(...value.binds);
              nextValue.types.push(...value.types);

              newValuesToMerge.push({
                start: value.start,
                end: nextValue.start,
                binds: value.binds,
                types: value.types,
              });

              value.start = nextValue.end + 1;

              didMerge = true;
            }
          }
        });
        
        valuesToMerge.push(...newValuesToMerge);
      };

      valuesToMerge.sort((a, b) => a.start - b.start);
    };

    mergeOverlapping(values);

    let currentMin = 0;

    // ~ Fill in empty blocks between inline blocks
    const elements = values.flatMap((inlineBlock) => {
      const elements: JSX.Element[] = [];

      if (inlineBlock.start > currentMin) {
        elements.push(
          <span key={currentMin}>{value.slice(currentMin, inlineBlock.start)}</span>
        );
      }


      const generateSubElements = (types: (keyof typeof InlineTextStyles)[], text: string) => {
        return (
          <span
            className={InlineTextStyles[types[0]]}
            data-keybinds={inlineBlock.binds.join('')}
          >
            {
              types.length > 1
                ? generateSubElements(types.slice(1), text)
                : text
            }
          </span>
        )
      };

    
      elements.push(
        generateSubElements(
          inlineBlock.types,
          value.slice(inlineBlock.start, inlineBlock.end).replace(/\\/g, ''),
        )
      );

      currentMin = inlineBlock.end;

      return elements;
    });

    if (currentMin < value.length) {
      elements.push(
        <span key={currentMin}>{value.slice(currentMin)}</span>
      );
    }

    if (!elements.length) {
      return <span>{value}</span>;
    }

    return elements;
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
        // handlePotentialInlineBlocks(e.currentTarget);
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
      {renderInlineBlocks(value)}
      {/* {value} */}
      {slashMenu}
    </span>
  );
};

export default TextBlock;
