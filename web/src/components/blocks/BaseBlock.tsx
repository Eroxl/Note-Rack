import React, { useState } from 'react';

import Icon from './Icon';
import Title from './Title';

interface BaseBlockProps {
  blockType: string,
  blockID: string,
  properties: any,
  style: any,
  page: string,
}

const blockTypes: {[key: string]: any} = {
  'page-icon': Icon,
  'page-title': Title,
};

const BaseBlock = (props: BaseBlockProps) => {
  const {
    blockType,
    blockID,
    properties,
    style,
    page,
  } = props;

  const [currentBlockType, setCurrentBlockType] = useState(blockType);

  return React.createElement(
    blockTypes[currentBlockType],
    {
      properties,
      style,
      blockID,
      page,
      setCurrentBlockType,
    },
  );
};

export default BaseBlock;
