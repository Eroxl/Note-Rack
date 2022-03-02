import React from 'react';

import Icon from './Icon';
import Title from './Title';
import Text from './Text';
import List from './List';
import type { BaseBlockProps } from '../../types/blockTypes';

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

  // -=- Semi-Text Based Components -=-
  quote: Text,
  callout: Text,

  // -=- List Based Components -=-
  'o-list': List,
  'u-list': List,
  'c-list': List,
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
    removeBlock,
  } = props;

  return React.createElement(
    blockTypes[blockType] ?? 'fragement',
    {
      properties: properties ?? {},
      style: style ?? {},
      type: blockType,
      blockID,
      page,
      index,
      addBlockAtIndex,
      removeBlock,
    },
  );
};

export default BaseBlock;
