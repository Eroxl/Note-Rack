import React from 'react';
import type { InBlockMutations } from '../types/BlockRenderer';
import type BlockState from '../types/BlockState';

type BlockWrapperProps = {
  mutations: InBlockMutations;
  block: BlockState;
  children: React.ReactNode;
};

const BlockWrapper: React.FC<BlockWrapperProps> = (props) => {
  const {
    block,
    children
  } = props;
  
  const { id } = block;

  return (
    <div
      id={`block-${id}`}
    >
      {children}
    </div>
  );
}

export default BlockWrapper;
