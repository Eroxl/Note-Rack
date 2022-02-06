import React from 'react';

import Icon from './Icon';
import Title from './Title';
import Text from './Text';

interface BaseBlockProps {
  blockType: string,
  blockID: string,
  properties: Record<string, unknown>,
  style: Record<string, unknown>,
  page: string,
  addBlockAtIndex: (index: number) => void,
  removeBlock: (blockID: string, index: number) => void,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const blockTypes: {[key: string]: any} = {
  // -=- Page Components -=-
  'page-icon': Icon,
  'page-title': Title,

  // -=- Text Based Components -=-
  text: Text,
  h1: Text,
  h2: Text,
  h3: Text,
  h4: Text,
  h5: Text,
};

const BaseBlock = (props: BaseBlockProps) => {
  const {
    blockType,
    blockID,
    properties,
    style,
    page,
    addBlockAtIndex,
    removeBlock,
  } = props;

  return React.createElement(
    blockTypes[blockType],
    {
      properties: properties ?? {},
      style: style ?? {},
      type: blockType,
      blockID,
      page,
      addBlockAtIndex,
      removeBlock,
    },
  );
};

export default BaseBlock;
