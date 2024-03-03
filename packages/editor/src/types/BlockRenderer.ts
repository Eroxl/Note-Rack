import React from 'react';

import mutations from '../mutations';
import type BlockState from './BlockState';
import type RemoveFirstFromTuple from './helpers/RemoveFirstFromTuple';


export type InBlockMutations = {
  [key in keyof typeof mutations]: (
    ...args: RemoveFirstFromTuple<Parameters<typeof mutations[key]>>
  ) => void;
};


export type BlockRendererProps<T = Record<string, unknown>> = BlockState<T> & {
  mutations: InBlockMutations;
  editorRef: React.RefObject<HTMLDivElement>;
};

type BlockRenderer<T = Record<string, unknown>> = React.FC<BlockRendererProps<T>>;

export default BlockRenderer;
