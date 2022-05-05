import React from 'react';

interface SubScriptProps {
  children: React.ReactNode[] | React.ReactNode,
  style?: React.CSSProperties | undefined,
}

const SubScript: React.FC<SubScriptProps> = (props) => {
  const { children, style } = props;

  return (
    <span
      style={{
        position: 'relative',
        fontSize: '0.8em',
        verticalAlign: '-0.5em',
        ...style,
      }}
    >
      {children}
    </span>
  );
};

export default SubScript;
