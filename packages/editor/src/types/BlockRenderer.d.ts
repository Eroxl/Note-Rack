import React from 'react';

import mutations from '../mutations';
import type BlockState from './BlockState';

type RemoveFirstFromTuple<T extends any[]> = (((...b: T) => void) extends (a, ...b: infer I) => void ? I : [])

export type InBlockMutations = {
  [key in keyof typeof mutations]: (
    ...args: RemoveFirstFromTuple<Parameters<typeof mutations[key]>>
  ) => void;
};


type BlockRenderer<T = Record<string, unknown>> = React.FC<
  Omit<BlockState<T>, 'type'> & {
    mutations: InBlockMutations;
  }
>;

export default BlockRenderer;
