import React, { useEffect, useRef } from 'react';

import focusElement from '../helpers/focusElement';
import getCursorOffset from '../helpers/caret/getCursorOffset';
import isElementFocused from '../helpers/isElementFocused';

type ContentEditableProps = {
  html: string;
  innerRef: React.RefObject<HTMLElement>;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  onChange: (event: React.FormEvent<HTMLSpanElement>) => void;
};

const ContentEditable: React.FC<ContentEditableProps> = (props) => {
  const {
    html,
    disabled,
    className,
    style,
    innerRef,
    onChange,
  } = props;

  const caretPosition = useRef<number | null>(null);

  useEffect(() => {
    if (!caretPosition.current || !innerRef.current) return;

    focusElement(innerRef.current, caretPosition.current);
    caretPosition.current = null;
  }, [caretPosition.current, innerRef.current]);

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

    return () => {
      document.removeEventListener('selectionchange', caretFixer);
    }
  }, [innerRef.current]);
  
  return (
    <span
      dangerouslySetInnerHTML={{ __html: (
        html.endsWith('\n') ? html : `${html}\n`
      )}}

      ref={innerRef}

      contentEditable={!disabled}
      suppressContentEditableWarning

      onInput={(event) => {
        if (!innerRef.current) return;

        caretPosition.current = getCursorOffset(innerRef.current);

        onChange(event);
      }}

      className={className}
      style={style}
    />
  )
};

ContentEditable.defaultProps = {
  disabled: false
};

export default ContentEditable;
