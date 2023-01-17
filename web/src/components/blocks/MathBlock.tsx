import React, { useState, useEffect } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

import type { EditableText } from '../../types/blockTypes';
import { addBlockAtIndex, editBlock } from '../../lib/pages/updatePage';

const MathBlock = (props: EditableText) => {
  const {
    blockID,
    properties,
    page,
    index,
    pageData,
    setPageData,
    setCurrentBlockType,
  } = props;
  const { value } = properties;

  const [currentValue, setCurrentValue] = useState(value || '');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!isEditing || !e.target) return;

      const target = e.target as HTMLElement;

      if (target.id !== blockID) {
        setIsEditing(false);
        editBlock([blockID], 'math', { value: currentValue }, page);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isEditing, blockID]);

  return (
    <div
      className="min-h-[1.2em] w-full"
      onClick={(isEditing || !currentValue) ? undefined : () => setIsEditing(true)}
      id={blockID}
      role={(isEditing || !currentValue) ? 'textbox' : 'button'}
      tabIndex={0}
    >
      {isEditing
        ? (
          <span
            className="min-h-[1.2em] outline-none whitespace-pre-wrap w-full flex"
            role="textbox"
            tabIndex={0}
            contentEditable
            suppressContentEditableWarning
            id={blockID}
            onBlur={
              (e) => {
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
                } else if (e.code === 'Backspace' && (e.currentTarget.innerText === '' || e.currentTarget.innerText === '\n')) {
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
            {currentValue}
          </span>
        )
        : (
          (!currentValue || currentValue === 'Edit to enter KaTeX' || currentValue === '\n')
          ? (
            <span
              className="min-h-[1.2em] outline-none whitespace-pre-wrap opacity-50"
              role="button"
              tabIndex={0}
              onClick={() => setIsEditing(true)}
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
        )
      }
    </div>
  )
};

export default MathBlock;
