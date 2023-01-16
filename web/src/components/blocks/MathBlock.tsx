import React from 'react';

interface MathBlockProps {
  blockID: string;
  properties: {
    value: string,
  }
}

const MathBlock = (props: MathBlockProps) => {
  const { blockID, properties } = props;

  return <div />;
};

export default MathBlock;
