import React from 'react';

export type FloatingLinkEditorProps = {
  href: string;
  setHref: React.Dispatch<React.SetStateAction<string>>
  floatingStyles: React.CSSProperties;
  setFloating: ((node: HTMLElement | null) => void) & ((node: HTMLElement | null) => void);
};

const createFloatingLinkEditor = (
  style?: React.CSSProperties,
  className?: string,
) => {
  const FloatingLinkEditor: React.FC<FloatingLinkEditorProps> = (props) => {
    const {
      href,
      setHref,
      floatingStyles,
      setFloating,
      ...floatingProps
    } = props;
  
    return (
      <div
        ref={setFloating}
        style={{
          ...floatingStyles,
          ...style,
        }}
        className={className}
        {...floatingProps}
      >
        {href}
      </div>
    );
  };
 
  return FloatingLinkEditor;
}

export default createFloatingLinkEditor;
