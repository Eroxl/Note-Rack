import React from 'react';

interface SuperScriptProps {
    children: React.ReactNode[] | React.ReactNode,
}

const SuperScript: React.FC<SuperScriptProps> = (props) => {
  const { children } = props;

  return (
    <span
      style={{
        position: 'relative',
        fontSize: '0.8em',
        verticalAlign: '0.5em',
      }}
    >
      {children}
    </span>
  );
};

export default SuperScript;
