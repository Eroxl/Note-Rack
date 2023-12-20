import React from 'react';

import BlockState from './BlockState';

type BlockRenderer<T = Record<string, unknown>> = React.FC<
  Omit<BlockState<T>, 'type'>
>;

export default BlockRenderer;
