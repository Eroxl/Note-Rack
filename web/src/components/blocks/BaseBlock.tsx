/* eslint-disable react/no-children-prop */
import React, { useState } from 'react';

import BlockTypes from '../../constants/BlockTypes';
import type { BaseBlockProps } from '../../types/blockTypes';

const BaseBlock = (props: BaseBlockProps) => {
  const {
    properties,
    blockType,
    children,
    blockID,
    page,
    index,
    addBlockAtIndex,
    removeBlock,
  } = props;

  const [currentBlockType, setCurrentBlockType] = useState(blockType);

  return React.createElement(
    BlockTypes[currentBlockType] ?? 'fragement',
    {
      properties: properties ?? {},
      type: currentBlockType,
      children: children ?? [],
      blockID,
      page,
      index,
      addBlockAtIndex,
      removeBlock,
      setCurrentBlockType,
    },
  );
};

export default BaseBlock;
