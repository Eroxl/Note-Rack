import React, { useState } from 'react';

import Icon from './Icon';
import Title from './Title';
import Text from './Text';

interface BaseBlockProps {
  blockType: string,
  blockID: string,
  properties: Record<string, unknown>,
  style: Record<string, unknown>,
  page: string,
  index: number,
  addBlockAtIndex: (index: number) => void,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const blockTypes: {[key: string]: any} = {
  'page-icon': Icon,
  'page-title': Title,
  text: Text,
};

const BaseBlock = (props: BaseBlockProps) => {
  const {
    blockType,
    blockID,
    properties,
    style,
    page,
    index,
    addBlockAtIndex,
  } = props;

  const [currentBlockType, setCurrentBlockType] = useState(blockType);

  return React.createElement(
    blockTypes[currentBlockType],
    {
      properties: properties ?? {},
      style: style ?? {},
      blockID,
      page,
      index,
      setCurrentBlockType,
      addBlockAtIndex,
    },
  );
};

export default BaseBlock;
