import React, { useRef, useState, useEffect } from "react";
import katex from "katex";
import focusElement from "@note-rack/editor/lib/helpers/focusElement";
import generateUUID from "@note-rack/editor/lib/helpers/generateUUID";
import type BlockRenderer from "@note-rack/editor/types/BlockRenderer";
import getCursorOffset from "@note-rack/editor/lib/helpers/caret/getCursorOffset";
import ContentEditable from "@note-rack/editor/components/ContentEditable";
import isElementFocused from "@note-rack/editor/lib/helpers/isElementFocused";

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

    const switchToEditing = () => {
      if (!isEditable) return;

      setIsEditing(true);

      setTimeout(() => {
        if (!editableElement.current) return;

        focusElement(editableElement.current, (editableElement.current.textContent?.length || 0) - 1);
      }, 7)
    }

    const getMathText = (element: HTMLElement) => {
      const textNodes = element.childNodes;

      let mathText = '';

      for (let i = 0; i < textNodes.length; i++) {
        const node = textNodes[i];

        if (node.nodeType === Node.TEXT_NODE) {
          mathText += node.textContent;
        } else if (node.nodeName === 'BR') {
          mathText += '\n';
        } else {
          mathText += getMathText(node as HTMLElement);
        }
      }
      
      return mathText;
    }

    useEffect(() => {
      const handleSelectionChange = () => {
        setTimeout(() => {
          if (!editableElement.current) return;

          if (isElementFocused(editableElement.current)) return;

          const newText = getMathText(editableElement.current);
          if (newText !== text) mutations.editBlock(id, { text: newText });

          setIsEditing(false);
          window.getSelection()?.removeAllRanges();
        }, 7)
      }

      document.addEventListener('selectionchange', handleSelectionChange);

      return () => {
        document.removeEventListener('selectionchange', handleSelectionChange);
      }
    }, []);
    
    if (isEditable && isEditing) {
      return (
        <ContentEditable
          style={{
            outline: 'none',
            whiteSpace: 'pre-wrap',
            maxWidth: '100vw',
            wordBreak: 'break-word',
            ...style
          }}
          className={className?.editing}
          innerRef={editableElement}
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
                  text: getMathText(editableElement.current)
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
          onChange={() => {}}
        >
          {text.endsWith('\n') ? text : text + '\n'}
        </ContentEditable>
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