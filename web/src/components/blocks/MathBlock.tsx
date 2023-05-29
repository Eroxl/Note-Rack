import React, { useState, useEffect, useContext } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

import type { EditableText } from '../../lib/types/blockTypes';
import { addBlockAtIndex, editBlock } from '../../lib/pages/updatePage';
import PageContext from '../../contexts/PageContext';

const MathBlock = (props: EditableText) => {
  const {
    blockID,
    properties,
    page,
    index,
    setCurrentBlockType,
  } = props;
  const { value } = properties;

  const { pageData, setPageData } = useContext(PageContext);

  const isAllowedToEdit = pageData!.userPermissions.write;

  const [currentValue, setCurrentValue] = useState(value || '');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const switchToEditing = () => {
    if (!isAllowedToEdit) return;

    setIsEditing(true);

    setTimeout(() => {
      const element = document.getElementById(blockID);

      if (element) {
        const range = document.createRange();
        const sel = window.getSelection();

        range.setStart(element.childNodes[0] || element, element.textContent?.length || 0);
        range.collapse(true);

        sel?.removeAllRanges();
        sel?.addRange(range);

        element.focus();
      }
    }, 10);
  };

  return (
    <div
      className="min-h-[1.2em] w-full h-full flex items-center justify-center"
      onClick={(isEditing || !currentValue) ? undefined : switchToEditing}
      id={`${blockID}-container`}
      role={(isEditing || !currentValue || !isAllowedToEdit) ? 'textbox' : 'button'}
      tabIndex={0}
    >
      {isEditing
        ? (
          <span
            className="min-h-[1.2em] outline-none whitespace-pre-wrap w-full"
            role="textbox"
            tabIndex={0}
            contentEditable
            suppressContentEditableWarning
            id={blockID}
            key={blockID}
            onBlur={
              (e) => {
                if (!isAllowedToEdit) return;

                setCurrentValue(e.currentTarget.innerText);
                editBlock([blockID], undefined, { value: e.currentTarget.innerText }, page);
                setIsEditing(false);
              }
            }
            onKeyDown={
              (e) => {
                if (e.code === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  e.currentTarget.blur();
                  addBlockAtIndex(index + 1, page, pageData, setPageData);
                } else if (e.code === 'Backspace' && window.getSelection()?.anchorOffset === 0) {
                  setCurrentBlockType('text');
                  editBlock([blockID], 'text', undefined, page);
                } else if (e.code === 'Backspace' && e.currentTarget.innerText === '') {
                  e.preventDefault();
                  e.currentTarget.blur();
                  setCurrentBlockType('text');
                  editBlock([blockID], 'text', undefined, page);
                }
              }
            }
            onCopy={() => {
              navigator.clipboard.writeText(`$$ ${window.getSelection()?.toString() || ''}`);
            }}
          >
            {
              (() => {
                if (currentValue !== '\n') {
                  return (
                    currentValue
                  );
                }
              })()
            }
          </span>
        )
        : (
          (!currentValue || currentValue === 'Edit to enter KaTeX' || currentValue === '\n')
            ? (
              <span
                className="min-h-[1.2em] outline-none whitespace-pre-wrap opacity-50"
                role="button"
                tabIndex={0}
                id={`preview-${blockID}`}
                key={`preview-${blockID}`}
                onClick={switchToEditing}
              >
                Edit to enter KaTeX
              </span>
            )
            : (
              <span
                className="min-h-[1.2em] outline-none whitespace-pre-wrap w-full flex justify-center align-middle"
                dangerouslySetInnerHTML={{ __html: katex.renderToString(currentValue, { throwOnError: false }) || 'Edit to enter KaTeX' }}
              />
            )
        )}
    </div>
  );
};

export default MathBlock;
