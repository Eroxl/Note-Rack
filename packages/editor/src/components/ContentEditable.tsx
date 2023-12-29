import React, { useEffect, useRef } from 'react';
import dom from "dompurify";

import focusElement from '../lib/helpers/focusElement';
import getCursorOffset from '../lib/helpers/caret/getCursorOffset';
import isElementFocused from '../lib/helpers/isElementFocused';
import { renderToString } from 'react-dom/server';

type ContentEditableProps = {
  children?: React.ReactNode;
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

  const caretUpdater = () => {
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

  useEffect(() => {
    if (!innerRef.current || !onBeforeChange) return;

    innerRef.current.addEventListener('beforeinput', onBeforeChange)

    return () => {
      if (!innerRef.current) return;

      innerRef.current.removeEventListener('beforeinput', onBeforeChange)
    }
  }, [innerRef.current])

  return (
    <span
      ref={innerRef}

      contentEditable={!disabled}
      suppressContentEditableWarning
      dangerouslySetInnerHTML={{
        __html: dom.sanitize(
          renderToString(children as React.ReactElement)
        ),
      }}

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
    />
  )
};

export default ContentEditable;
