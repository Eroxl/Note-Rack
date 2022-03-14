/* eslint-disable react/no-children-prop */
import React, { useState } from 'react';

import BlockTypes from '../../constants/BlockTypes';
import type { BaseBlockProps } from '../../types/blockTypes';

const BaseBlock = (props: BaseBlockProps) => {
  const {
    page,
    index,
    blockID,
    pageData,
    children,
    blockType,
    properties,
    setPageData,
  } = props;

  const [currentBlockType, setCurrentBlockType] = useState(blockType);

  return React.createElement(
    BlockTypes[currentBlockType] ?? 'fragement',
    {
      page,
      index,
      blockID,
      pageData,
      setPageData,
      setCurrentBlockType,
      type: currentBlockType,
      children: children ?? [],
      properties: properties ?? {},
    },
  );
};

export default BaseBlock;
