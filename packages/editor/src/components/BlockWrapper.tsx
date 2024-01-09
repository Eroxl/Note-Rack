import React from 'react';
import type { InBlockMutations } from '../types/BlockRenderer';
import type BlockState from '../types/BlockState';
import type BlockRenderer from '../types/BlockRenderer';

type BlockWrapperProps = {
  mutations: InBlockMutations;
  block: BlockState;
  blockRenderer: BlockRenderer,
};

const BlockWrapper: React.FC<BlockWrapperProps> = (props) => {
  const {
    block,
    mutations,
    blockRenderer: BlockRenderer,
  } = props;
  
  const { id } = block;

  return (
    <div
      id={`block-${id}`}
    >
      <BlockRenderer
        {...block}
        mutations={mutations}
      />
    </div>
  );
}

export default BlockWrapper;
