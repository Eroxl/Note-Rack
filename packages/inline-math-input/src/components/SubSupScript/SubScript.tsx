import React from 'react';

import '../../styles/index.css';

interface SubScriptProps {
  children: React.ReactNode[] | React.ReactNode,
  style?: React.CSSProperties | undefined,
}

const SubScript: React.FC<SubScriptProps> = (props) => {
  const { children, style } = props;

  return (
    <span
      className="math"
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
