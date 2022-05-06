import React from 'react';

import '../../styles/index.css';

interface SuperScriptProps {
  children?: React.ReactNode[] | React.ReactNode | undefined,
  style?: React.CSSProperties | undefined,
}

const SuperScript: React.FC<SuperScriptProps> = (props) => {
  const { children, style } = props;

  return (
    <span
      className="math"
      style={{
        position: 'relative',
        fontSize: '0.8em',
        verticalAlign: '0.5em',
        ...style,
      }}
    >
      {children}
    </span>
  );
};

export default SuperScript;
