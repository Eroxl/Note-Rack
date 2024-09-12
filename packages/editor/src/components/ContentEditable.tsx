import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import focusElement from '../lib/helpers/focusElement';
import getCursorOffset from '../lib/helpers/caret/getCursorOffset';
import isElementFocused from '../lib/helpers/isElementFocused';
import isElementEditable from '../lib/helpers/isElementEditable';

type ContentEditableProps = {
  children?: React.ReactNode | React.ReactNode[];
  innerRef: React.RefObject<HTMLElement>;
  className?: string;
  onChange: (event: React.FormEvent<HTMLSpanElement>) => void;
  onBeforeChange?: (event: InputEvent) => void;
  style?: React.CSSProperties;
  disabled?: boolean;
  onKeyDown?: (event: React.KeyboardEvent<HTMLSpanElement>) => void;
};

const ContentEditable: React.FC<ContentEditableProps> = (props) => {
  const {
    children,
    disabled,
    className,
    style,
    innerRef,
    onChange,
    onBeforeChange,
    onKeyDown
  } = props;

  const caretPosition = useRef<number | null>(null);
  const missedCharacters = useRef<string>('');

  const [childrenPortals, setChildrenPortals] = React.useState<React.ReactNode | React.ReactNode[]>([]);

  const caretUpdater = () => {
    if (!innerRef.current) return;

    innerRef.current.style.caretColor = 'auto';

    if (caretPosition.current === null) return;

    focusElement(innerRef.current, caretPosition.current);
    caretPosition.current = null;
  }

  useEffect(() => {
    const caretFixer = () => {
      if (!innerRef.current) return;
  
      if (!isElementFocused(innerRef.current)) return;
  
      const caretOffset = getCursorOffset(innerRef.current);
    
      if (caretOffset <= innerRef.current.innerText.length) return;
  
      caretPosition.current = caretOffset;

      focusElement(innerRef.current, caretOffset);
    }

    document.addEventListener('selectionchange', caretFixer);
    document.addEventListener('selectionchange', caretUpdater);

    return () => {
      document.removeEventListener('selectionchange', caretFixer);
      document.removeEventListener('selectionchange', caretUpdater);
    }
  }, [innerRef.current]);

  useEffect(() => {
    if (!innerRef.current) return;

    if (isElementFocused(innerRef.current)) {
      caretPosition.current = getCursorOffset(innerRef.current);
      innerRef.current.style.caretColor = 'transparent';
    }

    innerRef.current.innerHTML = '';

    const arrayChildren = Array.isArray(children) ? children : [children];

    const childrenPortals = arrayChildren
      .map((child, index) => {
        if (!innerRef.current) return;

        const childWrapperElement = document.createElement('span');
        innerRef.current.appendChild(childWrapperElement);

        const parsedChild = typeof child === 'string' ? (
          <span
            key={index}
          >
            {child}
          </span>
        ) : child

        return createPortal(parsedChild, childWrapperElement);
      })

    setChildrenPortals(childrenPortals);

    setTimeout(() => {
      caretUpdater();
    })
  }, [children, innerRef.current]);

  return (
    <span
      ref={innerRef}

      onClick={(e) => {
        if (!document.getSelection()?.getRangeAt(0).collapsed) return;

        const targetedElement = e.target as HTMLElement;
        const secondLastElement = innerRef.current?.childNodes[innerRef.current?.childNodes.length - 2] as HTMLElement;
        const isSecondLastElementEditable = isElementEditable(secondLastElement);
        
        if (targetedElement === innerRef.current) {
          const offset = isSecondLastElementEditable ? 1 : 0;

          focusElement(innerRef.current, (innerRef.current.textContent?.length || offset) - offset);
        }
        
        const isTargetedElementEditable = targetedElement.isContentEditable;
        const isTargetedElementLast = secondLastElement?.contains(targetedElement);

        if (
          !isTargetedElementLast
          || isTargetedElementEditable
          || !innerRef.current
        ) return;
  
        const targetedBoundingBox = targetedElement.getBoundingClientRect();
        const isNearEndOfElement = (targetedBoundingBox.x + targetedBoundingBox.width) <= e.clientX + 3;

        if (!isNearEndOfElement) return;

        focusElement(innerRef.current, innerRef.current.textContent?.length || 0);
      }}
      contentEditable={!disabled}
      suppressContentEditableWarning
      onBeforeInput={(event) => { 
        if (onBeforeChange) onBeforeChange(event as unknown as InputEvent);
        
        if (!caretPosition.current) return;
        
        console.error('Cursor fatally out of sync, preventing input event');

        missedCharacters.current += (event as any).data || '';

        event.preventDefault();
        event.stopPropagation();
      }}

      onKeyDown={onKeyDown}
      onInput={(event) => {
        if (!innerRef.current) return;

        caretPosition.current = getCursorOffset(innerRef.current);;
        innerRef.current.style.caretColor = 'transparent';

        if (missedCharacters.current && innerRef.current.textContent) {
          console.error('Characters out of sync, attempting to recover');

          const currentInlineBlock = document.getSelection()?.anchorNode;

          if (!currentInlineBlock?.textContent) return;

          const before = currentInlineBlock.textContent.slice(0, caretPosition.current-1);
          const after =  currentInlineBlock.textContent.slice(caretPosition.current-1);

          currentInlineBlock.textContent = before + missedCharacters.current + after;

          caretPosition.current += missedCharacters.current.length;

          missedCharacters.current = '';
        }

        onChange(event);
      }}

      className={className}
      style={style}
    >
      {childrenPortals}
    </span>
  )
};

export default ContentEditable;
