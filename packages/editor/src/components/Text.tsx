import React from 'react';

import type BlockRenderer from '../types/BlockRenderer';

export type TextProperties = {
  text: string;
};

const Text: BlockRenderer<TextProperties> = (props) => {
  const { properties } = props;
  const { text } = properties;

  return (
    <div>
      { text }
    </div>
  );
};

export default Text;
