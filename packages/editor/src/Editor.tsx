import React from 'react';

import type { Block } from './types/Block';
import type { BlockProps } from './types/Block';
import type { InlineBlock } from './types/InlineBlock';


type EditorProps = {
  blocks: Block[];
  inlineBlocks: InlineBlock[];

  startingState: BlockProps[]
};

const Editor = () => {

};

export default Editor;
