import React, { useEffect, useRef } from 'react';

import focusElement from '../lib/helpers/focusElement';
import getCursorOffset from '../lib/helpers/caret/getCursorOffset';
import isElementFocused from '../lib/helpers/isElementFocused';

type ContentEditableProps = {
  children?: React.ReactNode;
  innerRef: React.RefObject<HTMLElement>;
  className?: string;
  onChange: (event: React.FormEvent<HTMLSpanElement>) => void;
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
    onKeyDown
  } = props;

  const caretPosition = useRef<number | null>(null);

  const caretUpdater = (event?: Event) => {
    if (!caretPosition.current || !innerRef.current) return;

    innerRef.current.style.caretColor = 'auto';
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

  return (
    <span
      ref={innerRef}

      contentEditable={!disabled}
      suppressContentEditableWarning

      onBeforeInput={() => {        
        if (caretPosition.current === null) return;

        caretUpdater()
      }}

      onKeyDown={onKeyDown}
      onInput={(event) => {
        if (!innerRef.current) return;

        caretPosition.current = getCursorOffset(innerRef.current);;
        innerRef.current.style.caretColor = 'transparent';

        onChange(event);
      }}

      className={className}
      style={style}
    >
      {children}
    </span>
  )
};

export default ContentEditable;
