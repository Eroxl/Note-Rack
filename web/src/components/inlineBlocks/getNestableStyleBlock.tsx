import React from 'react';

interface NestableStyleBlockProps {
  children: React.ReactNode;
}

const getNestableStyleBlock = (className: string) => (
  (props: NestableStyleBlockProps) => {
    const { children } = props;
    
    return (
      <span
        className={`${className} outline-none whitespace-pre-wrap`}
        role="textbox"
        tabIndex={0}
        contentEditable
        suppressContentEditableWarning
      >
        {children}
      </span>
    );
  }
);

export default getNestableStyleBlock;
