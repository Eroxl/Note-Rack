import React, { useContext, useEffect, useState } from 'react';
import ContentEditable from 'react-contenteditable';

import PageContext from '../../contexts/PageContext';
import useSlashMenu, { createDefaultSlashMenuCategories } from '../../hooks/useSlashMenu';
import TextStyles from '../../lib/constants/TextStyles';
import getCursorOffset from '../../lib/helpers/caret/getCursorOffset';
import focusElement from '../../lib/helpers/focusElement';
import renderInlineBlocks from '../../lib/helpers/inlineBlocks/renderInlineBlocks';
import isElementFocused from '../../lib/helpers/isElementFocused';
import saveBlock from '../../lib/helpers/saveBlock';
import { addBlockAtIndex, editBlock, removeBlock } from '../../lib/pages/updatePage';
import textKeybinds from '../../lib/textKeybinds';
import type { EditableText } from '../../lib/types/blockTypes';
import handlePotentialInlineBlocks from '../../lib/helpers/inlineBlocks/handlePotentialInlineBlocks';
import getCompletion from '../../lib/helpers/getCompletion';

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

  /**
   * Change this blocks type and update the page
   * @param bind The keybind to change to
   */
  const changeBlockType = async (bind: typeof textKeybinds[number]) => {
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

    await editBlock([blockID], bind.type, newBlockProperties, page);
    setCurrentBlockType(bind.type);
  };

  const [editableRef, slashMenu] = useSlashMenu(
    createDefaultSlashMenuCategories(
      async (type) => {
        const bind = textKeybinds.find((bind) => bind.type === type);

        if (!bind) return;

        await changeBlockType(bind);
      }
    ),
    (text) => {
      setState((state) => ({
        ...state,
        value: text,
      }));
    }
  );

  /**
   * Handle the user typing a keybind
   * @param element The element to check
   */
  const handlePotentialTypeChange = async (element: HTMLSpanElement) => {
    for (let i = 0; i < textKeybinds.length; i++) {
      const bind = textKeybinds[i];

      if (!editableRef.current) return;

      const regexSearch = bind.keybind.exec(element.textContent || '');

      if (!regexSearch) continue;

      element.textContent = regexSearch[1] ?? '';

      await changeBlockType(bind);
      break;
    }
  };

  useEffect(() => {
    setState({
      style: properties.style,
      value: properties.value,
    });
  }, [properties.value, properties.style]);
  
  useEffect(() => {
    if (
      !editableRef.current
      || !editableRef.current.textContent
      || !state.value
      || !completion
    ) return;

    if (!isElementFocused(editableRef.current)) {
      setCompletion(null);
      setCompletionTimeout(null);
      return;
    }

    // ~ Ensure the cursor is never past the completion
    const caretOffset = getCursorOffset(editableRef.current);

    if (caretOffset > (editableRef.current.textContent?.length - completion.length)) {
      focusElement(editableRef.current, state.value.length);
    }
  }, [completion, editableRef.current]);

  useEffect(() => {
    const handleSelectionChange = () => {
      if (
        !editableRef.current?.textContent
        || !completion
      ) return;

      const caretOffset = getCursorOffset(editableRef.current);

      if (caretOffset >= (editableRef.current.textContent?.length - completion.length)) return;
        
      setCompletion(null);
      setCompletionTimeout(null);

      if (completionTimeout) {
        clearTimeout(completionTimeout);
      }

      setTimeout(() => {
        if (!editableRef.current) return;

        focusElement(editableRef.current, caretOffset);
      }, 0);
    };

    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    }
  }, [editableRef.current, completion, completionTimeout]);

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
              () => getCompletion(index).then(setCompletion),
              500
            )
          );

          setTimeout(() => {
            if (!editableRef.current) return;

            const value = saveBlock(editableRef.current, completion) || { value: '\n', style: [] };

            editBlock([blockID], undefined, value, page);
            setState(value);
          }, 0);
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
