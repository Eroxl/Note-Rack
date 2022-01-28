import React from 'react';

const Block = (props: { children: Element[] }) => {
  const { children } = props;

  return (
    <div>
      {children}
    </div>
  );
};

export default Block;
