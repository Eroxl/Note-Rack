import React from 'react';

import parseInlineBlocks from './parseInlineBlocks';
import InlineTypes from '../../../constants/InlineTypes';

const renderInlineBlocks = (text: string) => {
  const parsedText = parseInlineBlocks(text);

  const recursiveRender = (types: string[], value: string): React.ReactNode => {
    const blockType = types.shift();

    const Block = InlineTypes[blockType || ''] || React.Fragment;

    const children = types.length > 0
      ? recursiveRender(types, value)
      : value;

    return React.createElement(Block, {
      children,
    });
  };

  return parsedText.map((block) => recursiveRender(block.types, block.value));
};

export default renderInlineBlocks;
