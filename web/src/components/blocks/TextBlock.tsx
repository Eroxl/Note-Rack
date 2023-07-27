import crypto from 'crypto';
import React, { useContext, useEffect, useState } from 'react';
import ContentEditable from 'react-contenteditable';

import PageContext from '../../contexts/PageContext';
import useSlashMenu, { createDefaultSlashMenuCategories } from '../../hooks/useSlashMenu';
import InlineTextStyles from '../../lib/constants/InlineTextStyles';
import TextStyles from '../../lib/constants/TextStyles';
import getCursorOffset from '../../lib/helpers/caret/getCursorOffset';
import focusElement from '../../lib/helpers/focusElement';
import findNodesInRange from '../../lib/helpers/inlineBlocks/findNodesInRange';
import renderInlineBlocks from '../../lib/helpers/inlineBlocks/renderInlineBlocks';
import renderNewInlineBlocks from '../../lib/helpers/inlineBlocks/renderNewInlineBlocks';
import isElementFocused from '../../lib/helpers/isElementFocused';
import saveBlock from '../../lib/helpers/saveBlock';
import inlineTextKeybinds from '../../lib/inlineTextKeybinds';
import { addBlockAtIndex, editBlock, removeBlock } from '../../lib/pages/updatePage';
import textKeybinds from '../../lib/textKeybinds';
import type { EditableText } from '../../lib/types/blockTypes';

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
  const [completionTimeout, setCompletionTimeout] = useState<NodeJS.Timeout | null>(null);
  const [completion, setCompletion] = useState<string | null>(null);
  const [state, setState] = useState({
    value: properties.value,
    style: properties.style,
  });

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
    (text) => {
      setState((state) => ({
        ...state,
        value: text,
      }));
    }
  );

  const handlePotentialInlineBlocks = async (element: HTMLSpanElement) => {
    if (!editableRef.current) return;

    let cursorOffset = getCursorOffset(element);

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

      cursorOffset -= (regexSearch?.[1]?.length || 0) * (isAfterFullMatch ? 2 : 1);
      break;
    }

    setTimeout(() => {
      if (!editableRef.current) return;

      focusElement(editableRef.current, cursorOffset);
    }, 0);
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

  const createCompletion = async () => {
    if (!editableRef.current) return;

    const eventID = crypto.randomBytes(12).toString('hex');

    document.dispatchEvent(
      new CustomEvent('completionRequest', {
        detail: {
          index,
          eventID,
        },
      })
    );

    const handleCompletion = (event: CustomEvent<{ blockID: string; completion: string, eventID: string }>) => {
      if (
        event.detail.blockID !== blockID
        || eventID !== event.detail.eventID
      ) return;

      document.removeEventListener('completion', handleCompletion as EventListener);

      setCompletion(event.detail.completion);
    };

    document.addEventListener('completion', handleCompletion as EventListener);
  };

  /**
   * Ensure the state is always up to date
   */
  useEffect(() => {
    setState({
      style: properties.style,
      value: properties.value,
    });
  }, [properties.value, properties.style]);

  /**
   * Ensure the cursor is never past the completion
   */
  useEffect(() => {
    if (!editableRef.current || !state.value || !completion) return;

    if (!isElementFocused(editableRef.current)) {
      setCompletion(null);
      setCompletionTimeout(null);
      return;
    }

    const caretOffset = getCursorOffset(editableRef.current);

    if (caretOffset > state.value.length) {
      focusElement(editableRef.current, state.value.length);
    }
  }, [completion, editableRef.current, state.value]);

  return (
    <>
      <ContentEditable
        className={`min-h-[1.2em] outline-none relative whitespace-pre-wrap w-full ${TextStyles[type]}`}
        html={renderInlineBlocks(state.value, state.style, completion)}
        tagName="span"
        innerRef={editableRef}
        id={`block-${blockID}`}
        onChange={(_) => {
          if (!editableRef.current) return;

          handlePotentialTypeChange(editableRef.current);
          handlePotentialInlineBlocks(editableRef.current);

          if (completionTimeout) {
            clearTimeout(completionTimeout);
          }

          setCompletion(null);

          const value = saveBlock(editableRef.current, completion);

          if (!value) return;

          setState(value);

          if (
            getCursorOffset(editableRef.current) < (editableRef.current.innerText.length - 2)
            || editableRef.current.innerText.length <= 1
          ) return;

          setCompletionTimeout(
            setTimeout(
              createCompletion,
              500
            )
          );
        }}
        onBlur={() => {
          if (!editableRef.current) return;

          if (completionTimeout) {
            clearTimeout(completionTimeout);
          }

          setCompletion(null);
          setCompletionTimeout(null);

          const value = saveBlock(editableRef.current, completion) || { value: '\n', style: [] };

          editBlock([blockID], undefined, value, page);
          setState(value);
        }}
        onKeyDown={
          (event) => {
            if (!editableRef.current) return;

            if (event.code === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              event.currentTarget.blur();
              addBlockAtIndex(index + 1, page, pageData, setPageData);
            } else if (event.code === 'Backspace' && type !== 'text' && getCursorOffset(editableRef.current) === 0) {
              setCurrentBlockType('text');
              editBlock([blockID], 'text', undefined, page);
            } else if (event.code === 'Backspace' && type === 'text' && (editableRef.current.innerText === '' || editableRef.current.innerText === '\n')) {
              removeBlock(index, [blockID], page, pageData, setPageData, true);
            } else if (event.code === 'Tab' && completion !== null) {
              event.preventDefault();

              const value = saveBlock(editableRef.current, null);

              if (!value) return;

              setState(value);
              setCompletion(null);
            }
          }
        }
        disabled={!isAllowedToEdit}
        suppressContentEditableWarning
        data-block-index={index}
      />
      {slashMenu}
    </>
  );
};

export default TextBlock;
