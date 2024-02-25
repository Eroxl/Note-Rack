import React, { useRef, useState } from "react";
import katex from "katex";
import focusElement from "@note-rack/editor/lib/helpers/focusElement";
import generateUUID from "@note-rack/editor/lib/helpers/generateUUID";
import type BlockRenderer from "@note-rack/editor/types/BlockRenderer";
import getCursorOffset from "@note-rack/editor/lib/helpers/caret/getCursorOffset";

export type MathProperties = {
  text: string;
};

const createMathRenderer = (
  style?: {
    editing?: React.CSSProperties;
    preview?: React.CSSProperties;
  },
  className?: {
    editing?: string;
    preview?: string;
  },
  isEditable: boolean = true,
  katexOptions: katex.KatexOptions = {
    throwOnError: false,
    displayMode: true,
  }
) => {
  const Text: BlockRenderer<MathProperties> = (props) => {
    const { id, properties, mutations, type } = props;
    const { text } = properties;

    const [isEditing, setIsEditing] = useState(false);
  
    const editableElement = useRef<HTMLSpanElement>(null);

    const selectEnd = (element: HTMLElement) => {
      const range = document.createRange();
      range.selectNodeContents(element);
      range.collapse(false);

      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }

    const switchToEditing = () => {
      if (!isEditable) return;

      setIsEditing(true);

      setTimeout(() => {
        if (!editableElement.current) return;

        selectEnd(editableElement.current!);
      })
    }

    if (isEditable && isEditing) {
      return (
        <span
          role="textbox"
          tabIndex={0}
          contentEditable
          suppressContentEditableWarning
          style={style?.editing}
          className={className?.editing}
          ref={editableElement}
          onBlur={
            (event) => {
              if (!editableElement.current) return;

              const newText = event.currentTarget.textContent;
              if (newText !== text) mutations.editBlock(id, { text: newText });

              setIsEditing(false);
              window.getSelection()?.removeAllRanges();
            }
          }
          onKeyDown={(event) => {
            if (!editableElement.current) return;
  
            const isCursorAtStart = getCursorOffset(editableElement.current) === 0;
    
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
  
              mutations.addBlock(
                {
                  id: generateUUID(),
                  type: 'text',
                  properties: {
                    text: ''
                  }
                },
                id
              );
            } else if (event.code === 'Backspace'&& isCursorAtStart) {
              event.preventDefault();
              mutations.editBlock(
                id,
                {
                  text: event.currentTarget.textContent,
                },
                'text'
              );
  
              setTimeout(() => {
                const newBlock = document.getElementById(`block-${id}`)?.firstChild as (HTMLElement | undefined);
  
                if (!newBlock) return;
  
                focusElement(newBlock, 0);
              }, 7);
            }
          }}
        >
          {text}
        </span>
      );
    };

    if (!text && isEditable) {
      return (
        <span
          role="button"
          tabIndex={0}
          onClick={switchToEditing}
          style={style?.preview}
          className={className?.preview}
        >
          Click to enter KaTeX
        </span>
      )
    }

    return (
      <span
        role={isEditable ? "button" : undefined}
        style={style?.preview}
        className={className?.preview}
        dangerouslySetInnerHTML={{ __html: katex.renderToString(text, katexOptions) }}
        onClick={switchToEditing}
      />
    );
  };

  return Text;
}

export default createMathRenderer;