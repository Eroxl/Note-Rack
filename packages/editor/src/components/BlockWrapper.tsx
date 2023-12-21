import React from 'react';
import type { BlockRendererProps } from 'src/types/BlockRenderer';

type BlockWrapperProps = {
  children: React.ReactNode;
} & BlockRendererProps;

const BlockWrapper: React.FC<BlockWrapperProps> = (props) => {
  const { children, id } = props;
  
  return (
    <div
      id={`block-${id}`}
    >
      {children}
    </div>
  );
}

export default BlockWrapper;
